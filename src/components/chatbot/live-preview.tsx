// LivePreview.tsx
import React from 'react';

// --- Utility Icons (Inline SVG for self-contained file) ---

// Close Icon (X)
const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6L6 18M6 6L18 18" />
    </svg>
);

// Send Icon (Paper Plane)
const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

// WhatsApp Icon Placeholder
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.52 3.4 1.49 4.84l-1.57 5.76 5.89-1.54c1.42.79 3.03 1.25 4.1 1.25.04 0 .08 0 .12 0 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.72 13.56c-.34.34-.78.52-1.25.52-.47 0-.91-.18-1.25-.52l-2.02-2.02c-.34-.34-.52-.78-.52-1.25s.18-.91.52-1.25l1.01-1.01c.14-.14.22-.32.22-.51 0-.19-.08-.37-.22-.51l-1.01-1.01c-.68-.68-1.59-1.03-2.5-1.03-1.87 0-3.64.91-4.99 2.55-1.35 1.64-1.78 3.73-1.14 5.78l.58 1.83.69-.73c.34-.34.78-.52 1.25-.52.47 0 .91.18 1.25.52l1.64 1.64c.34.34.78.52 1.25.52s.91-.18 1.25-.52l2.84-2.84c.34-.34.52-.78.52-1.25s-.18-.91-.52-1.25z" />
    </svg>
);

// Email Icon Placeholder
const EmailIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
);

// Bot Icon (Used for 'Powered By' logo placeholder)
const BotIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 11V14M16 11V14M17 19H7C4.79086 19 3 17.2091 3 15V12C3 9.79086 4.79086 8 7 8H17C19.2091 8 21 9.79086 21 12V15C21 17.2091 19.2091 19 17 19Z" />
        <path d="M8 8V5C8 4.44772 8.44772 4 9 4H15C15.5523 4 16 4.44772 16 5V8" />
    </svg>
);

interface LivePreviewProps {
    primaryColor: string;
    windowBgColor: string;
    botBubbleColor: string;
    botTextColor: string;
    userBubbleColor: string;
    userTextColor: string;
    name: string;
    welcomeMessage: string;
    logoPreview: string | null;
    message: string;
    setMessage: (message: string) => void;
    handleSend: () => void;
}

interface MessageProps {
    text: string;
    time: string;
}

const LivePreview = ({
    primaryColor,
    windowBgColor,
    botBubbleColor,
    botTextColor,
    userBubbleColor,
    userTextColor,
    name,
    welcomeMessage,
    logoPreview,
    message,
    setMessage,
    handleSend,
}: LivePreviewProps) => {

    // Helper component for message bubbles with specific styles
    const BotMessage = ({ text, time }: MessageProps) => (
        <div className="flex items-start space-x-2">
            <div className='flex flex-col items-start'>
                <div
                    className="rounded-xl rounded-br-sm px-3 py-2 max-w-xs text-sm shadow-md"
                    style={{ backgroundColor: botBubbleColor, color: botTextColor }}
                >
                    {text}
                </div>
                <p className='text-xs text-white/70 mt-1'>{time}</p>
            </div>
        </div>
    );

    const UserMessage = ({ text, time }: MessageProps) => (
        <div className="flex justify-end">
            <div className='flex flex-col items-end'>
                <div
                    className="rounded-xl rounded-bl-sm px-3 py-2 max-w-xs text-sm shadow-md"
                    style={{ backgroundColor: userBubbleColor, color: userTextColor }}
                >
                    {text}
                </div>
                <p className='text-xs text-white/70 mt-1'>{time}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-4 w-full">

            {/* Main Chat Window Container */}
            <div
                className="border flex flex-col justify-between rounded-t-xl rounded-b-2xl overflow-hidden shadow-2xl w-full max-w-md mx-auto"
                style={{ backgroundColor: windowBgColor }}
            >
                {/* Chat Header - Separate color (primaryColor) */}
                <div
                    className="text-white p-4 flex items-center justify-between"
                    style={{ backgroundColor: primaryColor }}
                >
                    <div className='flex items-center space-x-3'>
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo" className="w-8 h-8 rounded-full object-cover shadow" />
                        ) : (
                            <div className="bg-black/20 p-2 rounded-full shadow">
                                <BotIcon className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div>
                            <p className="font-bold text-lg">{name || "Customer Support"}</p>
                            <p className="text-xs text-white/80">Online</p>
                        </div>
                    </div>
                    {/* Close Button */}
                    <button className="p-1 rounded-full text-white/80 hover:bg-white/20 transition-colors">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Chat Messages Area - Scrollable with same color as footer (windowBgColor) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[300px]" style={{ backgroundColor: windowBgColor }}>
                    {/* Welcome Bot Message 1: "Hello, how are you doing?" */}
                    <UserMessage text="Hello, how are you doing?" time="08:15 AM" />

                    {/* Bot Message 2: Welcome Message */}
                    <BotMessage text={welcomeMessage} time="08:16 AM" />

                    {/* User Message 3: */}
                    <UserMessage text="I have a question about the return policy for a product I purchased." time="Just Now" />

                    {/* Placeholder for Bot Typing indicator from the image */}
                    <div className='flex items-center space-x-1 justify-start'>
                        <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse delay-150"></div>
                    </div>
                </div>

                {/* Thick Separator Line */}
                <div className="h-2 bg-white/30 mx-4 rounded-full"></div>

                {/* Chat Input/Footer Area - Same color as chat area (windowBgColor) */}
                <div className="p-4 flex flex-col items-center space-y-2 rounded-b-2xl" style={{ backgroundColor: windowBgColor }}>

                    {/* Top Row: Input and Send Button */}
                    <div className="flex items-end w-full relative">

                        {/* Input Field */}
                       <input
  type="text"
  placeholder="Enter Your Message..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // stop form submission
      return false;
    }
  }}
  className="flex-1 w-full text-white text-sm bg-transparent border-none outline-none focus:outline-none focus:border-none focus:ring-0 placeholder-white/80 pt-4 pb-2 pl-0 pr-16"
/>



                        {/* Send Button - positioned absolutely right of the input text field */}
                        <button
                            type="button" // ✅ ensures this button never submits the parent form
                            disabled
                            className="p-4 rounded-full shadow-lg transition-all transform opacity-50 cursor-not-allowed absolute right-0 -bottom-4 z-10"
                            style={{
                                backgroundColor: primaryColor,
                                boxShadow:
                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)",
                            }}
                            aria-label="Send message"
                        >
                            <SendIcon className="w-6 h-6 text-white" />
                        </button>



                    </div>

                    {/* Bottom Row: Social Icons and Powered By */}
                    <div className="flex justify-between items-center w-full pt-2">
                        {/* Social Icons (Left) */}
                        <div className="flex space-x-3">
                            <WhatsAppIcon className="w-5 h-5 text-white/80 hover:text-white transition-colors cursor-pointer" />
                            <EmailIcon className="w-5 h-5 text-white/80 hover:text-white transition-colors cursor-pointer" />
                        </div>

                        {/* Powered By (Right) */}
                        <p className="text-xs text-white/70 flex items-center">
                            Powered By ChatSupplies
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LivePreview;