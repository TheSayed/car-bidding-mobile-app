import { useState, useEffect, useRef, useCallback } from "react";
import {
  onSnapshot,
  doc,
  setDoc,
  collection,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../../../config/FirestoreService";
import { auth } from "../../../config/firebase-config";
import {
  getAuctionDocumentPath,
  getBidsCollectionPath,
  getControlDocumentPath,
} from "../../../utilis/helper";
import {
  COOLDOWN_SECONDS,
  generateUniqueId,
  INITIAL_CONTROL_DATA,
  INITIAL_PRODUCT_DATA,
} from "../../../constant/auctionData";

// --- TYPE DEFINITIONS ---
type AuctionState = "ACTIVE" | "ENDED";

interface AuctionDataType {
  productName: string;
  currentBid: number;
  highestBidder: string;
  highestBidderId: string;
  lastBidTime: number;
  bidsMade: number;
  currentBidderId?: string;
}

interface BidHistory {
  id: string;
  userName: string;
  amount: number;
  timestamp: number;
  userId: string;
}

interface AuctionHookReturn {
  auctionData: AuctionDataType | null;
  bidsHistory: BidHistory[];
  auctionState: AuctionState;
  loading: boolean;
  currentAuctionId: string | null;
  userId: string | null;
  userName: string;
  isWinner: boolean;
  // NEW: Function to get current seconds remaining (doesn't cause re-renders)
  getSecondsRemaining: () => number;
  // Keep these for LandingScreen compatibility
  secondsRemaining: number;
  formattedTime: string;
}

declare const __app_id: string;

const APP_ID_CONTEXT =
  typeof __app_id !== "undefined" ? __app_id : "default-app-id";

// Helper function to format seconds into MM:SS
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export const useAuctionDataHook = (): AuctionHookReturn => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Guest");
  const [auctionData, setAuctionData] = useState<AuctionDataType | null>(null);
  const [bidsHistory, setBidsHistory] = useState<BidHistory[]>([]);

  // Keep this ONLY for LandingScreen - it will still cause re-renders there
  const [secondsRemaining, setSecondsRemaining] =
    useState<number>(COOLDOWN_SECONDS);

  const [auctionState, setAuctionState] = useState<AuctionState>("ACTIVE");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [currentAuctionId, setCurrentAuctionId] = useState<string | null>(null);

  // Track if we're in the process of auto-restarting
  const isAutoRestartingRef = useRef<boolean>(false);
  const autoRestartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Store the last bid time in a ref so we can calculate timer without state
  const lastBidTimeRef = useRef<number>(0);

  // --- AUTH LISTENER (MUST BE FIRST) ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName || `User_${user.uid.substring(0, 4)}`);
        console.log("Auth ready:", user.uid);
      } else {
        setUserId(null);
        setUserName("Guest");
        console.log("No user authenticated");
      }
      setIsAuthReady(true);
    });
    return () => unsubscribeAuth();
  }, []);

  // --- CONTROL DOCUMENT LISTENER ---
  useEffect(() => {
    if (!isAuthReady || !db || !auth.currentUser) {
      return;
    }

    const controlDocRef = doc(db, getControlDocumentPath(APP_ID_CONTEXT));

    const unsubscribeControl = onSnapshot(
      controlDocRef,
      async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const activeId = data?.activeAuctionId as string | null;

          if (activeId) {
            setCurrentAuctionId(activeId);
            isAutoRestartingRef.current = false;
          } else {
            const newId = generateUniqueId();
            const newAuctionRef = doc(
              db,
              getAuctionDocumentPath(APP_ID_CONTEXT, newId)
            );

            await setDoc(newAuctionRef, {
              ...INITIAL_PRODUCT_DATA,
              lastBidTime: Timestamp.now(),
              currentBidAmount: Number(INITIAL_PRODUCT_DATA.currentBidAmount),
              bidsMade: 0,
            });

            await setDoc(controlDocRef, {
              activeAuctionId: newId,
              status: "active",
              lastResetTime: Timestamp.now(),
            });
          }
        } else {
          await setDoc(controlDocRef, INITIAL_CONTROL_DATA);
        }
      },
      (e) => console.error("Control Snapshot Error:", e)
    );

    return () => unsubscribeControl();
  }, [isAuthReady]);

  // --- AUCTION DOCUMENT LISTENER ---
  useEffect(() => {
    if (!currentAuctionId || !auth.currentUser) {
      setAuctionData(null);
      return;
    }

    const auctionRef = doc(
      db,
      getAuctionDocumentPath(APP_ID_CONTEXT, currentAuctionId)
    );

    const unsubscribeAuction = onSnapshot(
      auctionRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const lastBidTime = (data.lastBidTime as Timestamp)
            ?.toDate()
            .getTime();

          // Update the ref for timer calculations
          lastBidTimeRef.current = lastBidTime;

          setAuctionData({
            productName: data.productName,
            currentBid: Number(data.currentBidAmount || 0),
            highestBidder: data.currentBidderName || "System Start",
            highestBidderId: data.currentBidderId || "system",
            lastBidTime,
            bidsMade: data.bidsMade || 0,
          });

          setLoading(false);
        }
      },
      (e) => {
        console.error("Auction Snapshot Error:", e);
        setLoading(false);
      }
    );

    return () => unsubscribeAuction();
  }, [currentAuctionId]);

  // --- BIDS HISTORY LISTENER ---
  useEffect(() => {
    if (!currentAuctionId || !auth.currentUser) {
      setBidsHistory([]);
      return;
    }

    const bidsCollectionRef = collection(
      db,
      getBidsCollectionPath(APP_ID_CONTEXT, currentAuctionId)
    );

    const q = query(bidsCollectionRef, orderBy("timestamp", "desc"));

    const unsubscribeBids = onSnapshot(
      q,
      (snapshot) => {
        const history = snapshot.docs.map((d) => ({
          id: d.id,
          userName: d.data().userName,
          amount: Number(d.data().amount),
          timestamp: (d.data().timestamp as Timestamp)?.toDate().getTime(),
          userId: d.data().userId,
        }));
        setBidsHistory(history);
      },
      (e) => console.error("History Snapshot Error:", e)
    );

    return () => unsubscribeBids();
  }, [currentAuctionId]);

  // Function to calculate remaining time without causing state updates
  const getSecondsRemaining = useCallback(() => {
    if (!lastBidTimeRef.current) return COOLDOWN_SECONDS;

    const now = Date.now();
    const elapsedSeconds = Math.floor((now - lastBidTimeRef.current) / 1000);
    const remaining = COOLDOWN_SECONDS - elapsedSeconds;

    return Math.max(0, remaining);
  }, []);

  // --- TIMER LOGIC WITH AUTO-RESTART ---
  useEffect(() => {
    if (!auctionData || !currentAuctionId) return;

    const checkAuctionEnd = async () => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - auctionData.lastBidTime) / 1000);
      const remaining = COOLDOWN_SECONDS - elapsedSeconds;

      // Update state for LandingScreen compatibility
      setSecondsRemaining(Math.max(0, remaining));

      if (remaining <= 0 && !isAutoRestartingRef.current) {
        // Auction ended - UPDATE STATE (this causes re-render, but only once)
        setAuctionState("ENDED");
        isAutoRestartingRef.current = true;

        autoRestartTimeoutRef.current = setTimeout(async () => {
          try {
            const controlDocRef = doc(
              db,
              getControlDocumentPath(APP_ID_CONTEXT)
            );
            const newId = generateUniqueId();
            const newAuctionRef = doc(
              db,
              getAuctionDocumentPath(APP_ID_CONTEXT, newId)
            );

            await setDoc(newAuctionRef, {
              ...INITIAL_PRODUCT_DATA,
              lastBidTime: Timestamp.now(),
              currentBidAmount: Number(INITIAL_PRODUCT_DATA.currentBidAmount),
              bidsMade: 0,
            });

            await setDoc(controlDocRef, {
              activeAuctionId: newId,
              status: "active",
              lastResetTime: Timestamp.now(),
            });

            console.log(`New auction started: ${newId}`);
          } catch (e) {
            console.error("Error auto-starting auction:", e);
            isAutoRestartingRef.current = false;
          }
        }, 3000);
      } else if (remaining > 0 && auctionState !== "ACTIVE") {
        setAuctionState("ACTIVE");
      }
    };

    checkAuctionEnd();
    const timerId = setInterval(checkAuctionEnd, 1000);

    return () => {
      clearInterval(timerId);
      if (autoRestartTimeoutRef.current) {
        clearTimeout(autoRestartTimeoutRef.current);
      }
    };
  }, [auctionData, currentAuctionId, auctionState]);

  const isWinner =
    auctionState === "ENDED" &&
    auctionData?.highestBidderId === userId &&
    userId !== null &&
    auctionData?.highestBidderId !== "system";

  return {
    auctionData,
    bidsHistory,
    secondsRemaining, // Keep for LandingScreen
    formattedTime: formatTime(secondsRemaining), // Keep for LandingScreen
    auctionState,
    loading: loading || !isAuthReady,
    currentAuctionId,
    userId,
    userName,
    isWinner,
    getSecondsRemaining, // NEW: Use this in AuctionScreen instead
  };
};

export default useAuctionDataHook;
