import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { doc, setDoc, Timestamp, addDoc, collection } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../../config/FirestoreService";
import {
  getAuctionDocumentPath,
  getBidsCollectionPath,
} from "../../../utilis/helper";
import { BID_INCREMENTS } from "../../../constant/auctionData";
import {
  openWinnerModal,
  closeWinnerModal,
  setWinnerName,
} from "../../../redux/winnerModalSlice";
import { RootState } from "../../../redux/store";
import useAuctionDataHook from "../../hooks/useAuctionDataHook"; // BACK TO ORIGINAL

declare const __app_id: string;
const APP_ID_CONTEXT =
  typeof __app_id !== "undefined" ? __app_id : "default-app-id";

const useAuctionScreenHook = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    showWinnerModal,
    lastDismissedAuctionId,
    winnerName: storedWinnerName,
  } = useSelector((state: RootState) => state.winnerModal);

  const {
    auctionData,
    bidsHistory,
    auctionState,
    loading,
    currentAuctionId,
    userId,
    userName,
    isWinner,
  } = useAuctionDataHook(); // USE ORIGINAL HOOK

  const [selectedIncrement, setSelectedIncrement] = useState(BID_INCREMENTS[0]);
  const [isBidding, setIsBidding] = useState(false);
  const [modalCountdown, setModalCountdown] = useState(3);

  const processedAuctionsRef = useRef<Set<string>>(new Set());

  const liveBiddersCount = useMemo(() => {
    if (bidsHistory.length === 0) return 0;
    const uniqueBidders = new Set(bidsHistory.map((bid) => bid.userId));
    return uniqueBidders.size;
  }, [bidsHistory.length, bidsHistory[0]?.userId]);

  useEffect(() => {
    if (!currentAuctionId) return;

    if (
      auctionState === "ENDED" &&
      !processedAuctionsRef.current.has(currentAuctionId) &&
      lastDismissedAuctionId !== currentAuctionId
    ) {
      const timeoutId = setTimeout(() => {
        if (!auctionData) return;

        const winnerToStore =
          auctionData.bidsMade === 0 ? "No one" : auctionData.highestBidder;

        dispatch(
          setWinnerName({
            auctionId: currentAuctionId,
            winnerName: winnerToStore,
          })
        );

        dispatch(openWinnerModal(currentAuctionId));
        processedAuctionsRef.current.add(currentAuctionId);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [
    auctionState,
    currentAuctionId,
    lastDismissedAuctionId,
    auctionData,
    dispatch,
  ]);

  useEffect(() => {
    if (showWinnerModal) {
      setModalCountdown(3);
      const countdownInterval = setInterval(() => {
        setModalCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [showWinnerModal]);

  const handlePlaceBid = useCallback(async () => {
    if (!auctionData || !userId || !currentAuctionId || isBidding) return;

    const newBidAmount = auctionData.currentBid + selectedIncrement;

    setIsBidding(true);
    try {
      const auctionRef = doc(
        db,
        getAuctionDocumentPath(APP_ID_CONTEXT, currentAuctionId)
      );
      const bidsCollectionRef = collection(
        db,
        getBidsCollectionPath(APP_ID_CONTEXT, currentAuctionId)
      );

      await setDoc(
        auctionRef,
        {
          currentBidAmount: newBidAmount,
          currentBidderId: userId,
          currentBidderName: userName,
          lastBidTime: Timestamp.now(),
          bidsMade: (auctionData.bidsMade || 0) + 1,
        },
        { merge: true }
      );

      await addDoc(bidsCollectionRef, {
        amount: newBidAmount,
        userId,
        userName,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error placing bid:", error);
    } finally {
      setIsBidding(false);
    }
  }, [
    auctionData,
    userId,
    currentAuctionId,
    selectedIncrement,
    userName,
    isBidding,
  ]);

  const handleBackToLanding = useCallback(() => {
    dispatch(closeWinnerModal());
    navigation.navigate("Landing" as never);
  }, [dispatch, navigation]);

  const ctaDisabled = auctionState === "ENDED" || isBidding;

  const ctaText = useMemo(() => {
    if (auctionState === "ENDED") return "Auction Ended";
    if (isBidding) return "Placing Bid...";
    if (auctionData?.highestBidderId === userId)
      return "You're Leading - Bid Again";
    return "Place Bid";
  }, [auctionState, isBidding, auctionData?.highestBidderId, userId]);

  const displayCurrentBid = useMemo(
    () => auctionData?.currentBid.toLocaleString() || "0",
    [auctionData?.currentBid]
  );

  return {
    auctionData,
    bidsHistory,
    auctionState,
    loading,
    currentAuctionId,
    userId,
    userName,
    isWinner,
    selectedIncrement,
    isBidding,
    showWinnerModal,
    modalCountdown,
    liveBiddersCount,
    ctaDisabled,
    ctaText,
    displayCurrentBid,
    storedWinnerName,
    handlePlaceBid,
    setSelectedIncrement,
    handleBackToLanding,
  };
};

export default useAuctionScreenHook;
