"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Set a target date 3 days from now for demonstration
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 2);
        targetDate.setHours(targetDate.getHours() + 5);

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const TimerBox = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl w-12 h-12 flex items-center justify-center mb-1">
                <span className="text-xl font-black text-white leading-none">
                    {value.toString().padStart(2, "0")}
                </span>
            </div>
            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{label}</span>
        </div>
    );

    return (
        <div className="flex gap-3">
            <TimerBox value={timeLeft.days} label="Days" />
            <TimerBox value={timeLeft.hours} label="Hrs" />
            <TimerBox value={timeLeft.minutes} label="Min" />
            <TimerBox value={timeLeft.seconds} label="Sec" />
        </div>
    );
}
