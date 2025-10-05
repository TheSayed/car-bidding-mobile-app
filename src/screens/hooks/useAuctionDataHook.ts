// useAuctionDataHook.tsx - FINAL FIX (Auto-restart working)
import { useState, useEffect, useRef } from "react";
import {
  onSnapshot,
  doc,
  setDoc,
  collection,
  query,
  orderBy,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../../config/FirestoreService";
import { auth } from "../../config/firebase-config";
import {
  getAuctionDocumentPath,
  getBidsCollectionPath,
  getControlDocumentPath,
} from "../../utilis/helper";
import {
  COOLDOWN_SECONDS,
  generateUniqueId,
  INITIAL_CONTROL_DATA,
  INITIAL_PRODUCT_DATA,
} from "../../constant/auctionData";

type AuctionState = "ACTIVE" | "ENDED";

interface AuctionDataType {
  productName: string;
  currentBid: number;
  highestBidder: string;
  highestBidderId: string;
  lastBidTime: number;
  bidsMade: number;
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
  secondsRemaining: number;
  formattedTime: string;
}

declare const __app_id: string;
const APP_ID_CONTEXT =
  typeof __app_id !== "undefined" ? __app_id : "default-app-id";

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
  const [secondsRemaining, setSecondsRemaining] =
    useState<number>(COOLDOWN_SECONDS);
  const [auctionState, setAuctionState] = useState<AuctionState>("ACTIVE");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [currentAuctionId, setCurrentAuctionId] = useState<string | null>(null);

  const isAutoRestartingRef = useRef<boolean>(false);
  const autoRestartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const processedEndedAuctionsRef = useRef<Set<string>>(new Set());

  // Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName || `User_${user.uid.substring(0, 4)}`);
      } else {
        setUserId(null);
        setUserName("Guest");
      }
      setIsAuthReady(true);
    });
    return () => unsubscribeAuth();
  }, []);

  // Listen to control doc changes
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
            // Verify auction doc exists
            const auctionRef = doc(
              db,
              getAuctionDocumentPath(APP_ID_CONTEXT, activeId)
            );
            const auctionSnap = await getDoc(auctionRef);

            if (!auctionSnap.exists()) {
              await setDoc(auctionRef, {
                ...INITIAL_PRODUCT_DATA,
                lastBidTime: Timestamp.now(),
                currentBidAmount: Number(INITIAL_PRODUCT_DATA.currentBidAmount),
                bidsMade: 0,
              });
            }

            setCurrentAuctionId(activeId);
            isAutoRestartingRef.current = false; // Reset flag when switching to new auction
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
      },
      (error) => {
        console.error("❌ Control Snapshot Error:", error);
      }
    );

    return () => unsubscribeControl();
  }, [isAuthReady]);

  // Listen to auction doc changes
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
      async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();

          let lastBidTime: number;
          if (data.lastBidTime instanceof Timestamp) {
            lastBidTime = data.lastBidTime.toDate().getTime();
          } else if (typeof data.lastBidTime === "number") {
            lastBidTime = data.lastBidTime;
          } else {
            console.warn("⚠️ lastBidTime missing, using current time");
            lastBidTime = Date.now();
          }

          // CHECK IF AUCTION IS EXPIRED BEFORE LOADING
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - lastBidTime) / 1000);
          const remaining = COOLDOWN_SECONDS - elapsedSeconds;

          if (
            remaining <= -5 &&
            !processedEndedAuctionsRef.current.has(currentAuctionId)
          ) {
            processedEndedAuctionsRef.current.add(currentAuctionId);

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

              return; // Don't set the old auction data
            } catch (e) {
              console.error("❌ Error replacing expired auction:", e);
            }
          }

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
      (error) => {
        setLoading(false);
      }
    );

    return () => unsubscribeAuction();
  }, [currentAuctionId]);

  // Listen to bids history
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
      (e) => console.error("❌ History Snapshot Error:", e)
    );

    return () => unsubscribeBids();
  }, [currentAuctionId]);

  // Timer and auto-restart logic
  useEffect(() => {
    if (!auctionData || !currentAuctionId) {
      return;
    }

    // Skip if already processed
    if (processedEndedAuctionsRef.current.has(currentAuctionId)) {
      setSecondsRemaining(0);
      setAuctionState("ENDED");
      return;
    }

    const calculateTime = () => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - auctionData.lastBidTime) / 1000);
      const remaining = COOLDOWN_SECONDS - elapsedSeconds;

      setSecondsRemaining(Math.max(0, remaining));

      // Check if auction has ended
      if (remaining <= 0 && !isAutoRestartingRef.current) {
        setAuctionState("ENDED");
        isAutoRestartingRef.current = true;
        processedEndedAuctionsRef.current.add(currentAuctionId);

        setTimeout(async () => {
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
          } catch (e) {
            console.error("❌ Error auto-restarting:", e);
            isAutoRestartingRef.current = false;
            processedEndedAuctionsRef.current.delete(currentAuctionId);
          }
        }, 3000);
      } else if (remaining > 0 && auctionState !== "ACTIVE") {
        setAuctionState("ACTIVE");
      }
    };

    calculateTime();
    const timerId = setInterval(calculateTime, 1000);

    return () => {
      clearInterval(timerId);
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
    secondsRemaining,
    formattedTime: formatTime(secondsRemaining),
    auctionState,
    loading: loading || !isAuthReady,
    currentAuctionId,
    userId,
    userName,
    isWinner,
  };
};

export default useAuctionDataHook;
