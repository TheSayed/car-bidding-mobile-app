// components/TimerDisplay/TimerDisplay.tsx
import React, { useState, useEffect, memo } from "react";
import { Text, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatTimeRemaining } from "../../../../utilis/helper";
import { COLORS } from "../../../../constant/COLORS";
import styles from "./TimerDisplay.styles";

interface TimerDisplayProps {
  lastBidTime: number; // Pass the timestamp, not seconds remaining
  cooldownSeconds: number;
  onTimerEnd?: () => void;
}

interface TimerState {
  text: string;
  color: string;
  isActive: boolean;
}

const TimerDisplay = memo(
  ({ lastBidTime, cooldownSeconds, onTimerEnd }: TimerDisplayProps) => {
    const [timerState, setTimerState] = useState<TimerState>({
      text: formatTimeRemaining(cooldownSeconds),
      color: "#4CAF50",
      isActive: true,
    });

    useEffect(() => {
      const calculateTimer = () => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - lastBidTime) / 1000);
        const remaining = cooldownSeconds - elapsedSeconds;

        if (remaining <= 0) {
          setTimerState({
            text: "AUCTION ENDED",
            color: COLORS.ACCENT_ORANGE,
            isActive: false,
          });
          onTimerEnd?.();
          return;
        }

        const color = remaining <= 10 ? COLORS.RED : COLORS.GREEN_SUCCESS;

        setTimerState({
          text: formatTimeRemaining(remaining),
          color,
          isActive: true,
        });
      };

      calculateTimer();
      const interval = setInterval(calculateTimer, 1000);

      return () => clearInterval(interval);
    }, [lastBidTime, cooldownSeconds, onTimerEnd]);

    return (
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="timer"
          size={18}
          color={timerState.color}
          style={styles.icon}
        />
        <Text style={[styles.text, { color: timerState.color }]}>
          {timerState.text}
        </Text>
      </View>
    );
  }
);

TimerDisplay.displayName = "TimerDisplay";

export default TimerDisplay;
