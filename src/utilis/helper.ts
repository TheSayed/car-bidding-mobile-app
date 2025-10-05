import { CONTROL_DOC_ID } from "../constant/auctionData";

export function getAuctionDocumentPath(
  appId: string,
  auctionId: string
): string {
  return `artifacts/${appId}/public/data/auctions/${auctionId}`;
}

export function getBidsCollectionPath(
  appId: string,
  auctionId: string
): string {
  return `${getAuctionDocumentPath(appId, auctionId)}/bids`;
}

export const getControlDocumentPath = (appId: string): string =>
  `artifacts/${appId}/public/data/auctions-control/${CONTROL_DOC_ID}`;

export function formatTimeRemaining(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) return "resetting...";

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
export function formatRelativeTime(date: Date | null): string {
  if (!date) return "N/A";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffInSeconds < minute) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < hour) {
    const minutes = Math.floor(diffInSeconds / minute);
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < day) {
    const hours = Math.floor(diffInSeconds / hour);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString();
  }
}
