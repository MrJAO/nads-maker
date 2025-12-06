import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomLine } from './extraLines';

function App() {
  const videoRef = useRef(null);
  const [displayText, setDisplayText] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [textKey, setTextKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, []);

  const handleClick = (e) => {
    if (videoRef.current && videoRef.current.muted) {
      videoRef.current.muted = false;
    }
    setMousePos({ x: e.clientX, y: e.clientY });
    setDisplayText(getRandomLine());
    setTextKey(prev => prev + 1);
    setTimeout(() => setDisplayText(''), 2500);
  };

  const handleEnter = (e) => {
    e.stopPropagation();
    navigate('/1mon');
  };

  return (
    <div className="app-container" onClick={handleClick}>
      <video 
        ref={videoRef}
        loop 
        muted
        playsInline
        className="background-video"
      >
        <source src="/main_bg.mp4" type="video/mp4" />
      </video>
      
      <div className="content">
        {displayText && (
          <div 
            key={textKey}
            className="random-text" 
            style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
          >
            {displayText}
          </div>
        )}
        <button className="enter-button" onClick={handleEnter}>
          ENTER
        </button>
      </div>
    </div>
  );
}

export default App;
