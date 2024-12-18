import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = () => {
  const [result, setResult] = useState(""); // QR kod ma'lumotlarini saqlaydi
  const scannerRef = useRef(null); // Skannerni saqlash uchun
  const videoRef = useRef(null); // Video elementiga kirish
  const [isScanning, setIsScanning] = useState(false); // Skanning holatini tekshirish

  useEffect(() => {
    const startScanner = async () => {
      try {
        // Kamera ruxsatini olish
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (stream) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadeddata = () => {
            if (videoRef.current && videoRef.current.paused) {
              videoRef.current.play(); // Agar video to'xtagan bo'lsa, uni o'ynatish
            }
          };

          // Skannerni ishga tushurish
          const scanner = new Html5QrcodeScanner("reader", {
            fps: 10, // Skanning tezligi
            qrbox: { width: 250, height: 250 }, // QR qutining hajmi
            formatsToSupport: ["QR_CODE"], // QR kod formatini qo'llab-quvvatlash
          });

          // QR kodni o'qish va ma'lumotni saqlash
          scanner.render(
            (decodedText) => {
              console.log("O'qilgan QR kod ma'lumotlari:", decodedText); // Konsolga o'qilgan natijani chiqarish
              setResult(decodedText); // QR kodni o'qigandan keyin ma'lumotni saqlash
              setIsScanning(false); // Skanning tugaganini bildiradi
            },
            (error) => {
              console.warn("Skaner xatoligi:", error); // Xatoliklarni ko'rsatish
            }
          );

          // Skannerni saqlash
          scannerRef.current = scanner;
          setIsScanning(true);
        } else {
          console.error("Kamera oqimi olinmadi.");
        }
      } catch (err) {
        console.error("Kamera ruxsati berilmadi:", err);
      }
    };

    startScanner();

    // Component unmount bo'lganda tozalash
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear(); // Skannerni tozalash
      }
    };
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Kamerani QR kodga yo'nalting
      </h1>

      <div className="relative w-80 h-60 border-4 border-gray-400 rounded-lg">
        <video
          ref={videoRef}
          className="w-full h-full absolute top-0 left-0"
          id="reader"
        ></video>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-green-700 rounded text-white">
          <p>O'qilgan ma'lumot:</p>
          <span className="font-semibold text-lg">{result}</span>
        </div>
      )}

      {/* Skanning holati */}
      {isScanning ? (
        <p className="mt-4 text-green-400">QR kodni skanerlash davom etmoqda...</p>
      ) : (
        result === "" && (
          <p className="mt-4 text-red-400">Kamera ishlamayapti.</p>
        )
      )}
    </div>
  );
};

export default QRScanner;
