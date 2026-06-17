"use client";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OfficeBell() {

    const playOffTimeBell = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const playTone = (freq, startTime, duration, volume = 0.3) => {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                oscillator.type = "sine";
                oscillator.frequency.setValueAtTime(freq, startTime);
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            };
            const now = ctx.currentTime;
            playTone(523, now, 0.3, 0.4);
            playTone(659, now + 0.2, 0.3, 0.4);
            playTone(784, now + 0.4, 0.3, 0.4);
            playTone(1047, now + 0.6, 0.6, 0.4);
            playTone(784, now + 0.9, 0.2, 0.3);
            playTone(1047, now + 1.1, 1.0, 0.4);
        } catch (err) {
            console.log("Audio not supported:", err);
        }
    };

    useEffect(() => {
        const checkOfficeEnd = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            if (hours === 19 && minutes >= 0 && minutes <= 2) {
                const key = `officeBell_${now.toISOString().slice(0, 10)}`; // "2026-06-17"
                if (!localStorage.getItem(key)) {
                    localStorage.setItem(key, "1");
                    playOffTimeBell();
                    toast.success("🎉 Chhutti! Office time over!", { duration: 10000 });
                }
            }
        };

        const interval = setInterval(checkOfficeEnd, 1000);
        return () => clearInterval(interval);
    }, []);

    return null; // koi UI nahi — sirf background task
}