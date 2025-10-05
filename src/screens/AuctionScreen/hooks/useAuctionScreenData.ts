// hooks/useAuctionScreenData.tsx
import { useState, useEffect, useRef, useMemo } from "react";
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

declare const __app_id: string;
const APP_ID_CONTEXT =
  typeof __app_id !== "undefined" ? __app_id : "default-app-id";

export const useAuctionScreenData = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Guest");
  const [auctionData, setAuctionData] = useState<AuctionDataType | null>(null);
  const [bidsHistory, setBidsHistory] = useState<BidHistory[]>([]);
  const [auctionState, setAuctionState] = useState<AuctionState>("ACTIVE");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [currentAuctionId, setCurrentAuctionId] = useState<string | null>(null);

  const isAutoRestartingRef = useRef<boolean>(false);
  const autoRestartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // AUTH LISTENER
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

  // CONTROL DOCUMENT LISTENER
  useEffect(() => {
    if (!isAuthReady || !db || !auth.currentUser) return;

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

  // AUCTION DOCUMENT LISTENER
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

          // FIXED: Handle undefined lastBidTime safely
          let lastBidTime: number;
          if (data.lastBidTime instanceof Timestamp) {
            lastBidTime = data.lastBidTime.toDate().getTime();
          } else if (typeof data.lastBidTime === "number") {
            lastBidTime = data.lastBidTime;
          } else {
            lastBidTime = Date.now();
            console.warn(
              "lastBidTime missing from auction document, using current time"
            );
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
      (e) => {
        console.error("Auction Snapshot Error:", e);
        setLoading(false);
      }
    );

    return () => unsubscribeAuction();
  }, [currentAuctionId]);

  // BIDS HISTORY LISTENER
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

  // TIMER LOGIC - NO STATE UPDATES FOR COUNTDOWN
  useEffect(() => {
    if (!auctionData || !currentAuctionId) return;

    const checkAuctionStatus = async () => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - auctionData.lastBidTime) / 1000);
      const remaining = COOLDOWN_SECONDS - elapsedSeconds;

      // ONLY update state when auction ENDS
      if (
        remaining <= 0 &&
        !isAutoRestartingRef.current &&
        auctionState !== "ENDED"
      ) {
        setAuctionState("ENDED");
        isAutoRestartingRef.current = true;

        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }

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

    checkAuctionStatus();
    timerIntervalRef.current = setInterval(checkAuctionStatus, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (autoRestartTimeoutRef.current) {
        clearTimeout(autoRestartTimeoutRef.current);
      }
    };
  }, [auctionData?.lastBidTime, currentAuctionId, auctionState]);

  const isWinner = useMemo(
    () =>
      auctionState === "ENDED" &&
      auctionData?.highestBidderId === userId &&
      userId !== null &&
      auctionData?.highestBidderId !== "system",
    [auctionState, auctionData?.highestBidderId, userId]
  );

  return {
    auctionData,
    bidsHistory,
    auctionState,
    loading: loading || !isAuthReady,
    currentAuctionId,
    userId,
    userName,
    isWinner,
  };
};

export default useAuctionScreenData;
