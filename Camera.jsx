import React, { useRef, useState, useEffect } from "react";

export default function AttendanceApp() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [cameraOn, setCameraOn] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });
            videoRef.current.srcObject = stream;
            setCameraOn(true);
        } catch (err) {
            alert("Camera access denied");
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        setCameraOn(false);
    };

    const takePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);
        setPhoto(canvas.toDataURL("image/png"));
    };

    const submitAttendance = () => {
        alert("Attendance submitted (frontend only)");
    };

    return (
        <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-2">Attendance</h1>
                <p className="text-center text-gray-500 mb-4">
                    {time.toLocaleDateString()} – {time.toLocaleTimeString()}
                </p>

                {!cameraOn && (
                    <button
                        onClick={startCamera}
                        className="w-full bg-blue-600 text-white py-2 rounded-xl mb-4"
                    >
                        Open Camera
                    </button>
                )}

                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-4">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </div>

                {cameraOn && (
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={takePhoto}
                            className="flex-1 bg-green-600 text-white py-2 rounded-xl"
                        >
                            Take Photo
                        </button>
                        <button
                            onClick={stopCamera}
                            className="flex-1 bg-red-600 text-white py-2 rounded-xl"
                        >
                            Close Camera
                        </button>
                    </div>
                )}

                {photo && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Captured Photo</p>
                        <img
                            src={photo}
                            alt="attendance"
                            className="rounded-xl border"
                        />
                    </div>
                )}

                <button
                    onClick={submitAttendance}
                    disabled={!photo}
                    className="w-full bg-purple-600 text-white py-2 rounded-xl disabled:opacity-50"
                >
                    Submit Attendance
                </button>

                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}
