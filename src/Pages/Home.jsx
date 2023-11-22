import React, { useRef, useState } from "react";
import "./home.css";
import Screenrecoding from "../Component/Screenrecoding";
import Recodings from "../Component/Recodings";
import AudioRecord from "../Component/AudioRecord";
import UploadVedio from "../Component/UploadVedio";
import Logo from "../Asset/SVG/dreampotential_Logo-01.svg";

const Home = () => {
  const [screenRecord, setScreenRecord] = useState(false);
  const [audioRecord, setaudioRecord] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordd, setRecord] = useState(false);

  const screenRef = useRef(null);
  const audioRef = useRef(null);
  const vedioRef = useRef(null);

  // Call Screen Record Function for Recoding
  const handleScreen = () => {
    if (!screenRecord) {
      setRecord(true);
      screenRef.current.Start();
      setScreenRecord(true);
    } else {
      screenRef.current.Stop();
      setScreenRecord(false);
    }
  };

  // Call Record Vedio Function for Recoding
  const handleRecoding = () => {
    if (!recording) {
      setRecord(true);
      vedioRef.current.Start();
      setRecording(true);
    } else {
      vedioRef.current.Stop();
      setRecording(false);
    }
  };

  // Call Audio Function for Recoding
  const handleAudio = () => {
    if (!audioRecord) {
      audioRef.current.Start();
      setaudioRecord(true);
    } else {
      audioRef.current.Stop();
      setaudioRecord(false);
    }
  };

  return (
    <>
      <div className="main">
        <div className="navbar">
          <div className="nav-logo">
            <img src={Logo} alt="Logo" />
          </div>
          <div className="nav-links"></div>
        </div>
        <div
          className="content"
          style={{
            padding: `${recordd === true ? "0" : "5rem 0"}`,
          }}
        >
          <div className="btn-container">
            {screenRecord ? (
              <button onClick={handleScreen} className="btn">
                Stop Screen Recording
              </button>
            ) : (
              <button onClick={handleScreen} className="btn">
                Start Screen Recording
              </button>
            )}
            {recording ? (
              <button onClick={handleRecoding} className="btn">
                Stop Vedio Recording
              </button>
            ) : (
              <button onClick={handleRecoding} className="btn">
                Start Vedio Recording
              </button>
            )}
            {audioRecord ? (
              <button onClick={handleAudio} className="btn">
                Stop Audio Recording
              </button>
            ) : (
              <button onClick={handleAudio} className="btn">
                Start Audio Recording
              </button>
            )}
          </div>

          <div className="vedio-container">
            <div className="row-1">
              <Screenrecoding ref={screenRef} />
              <Recodings ref={vedioRef} />
            </div>
            <div className="row-2">
              <AudioRecord ref={audioRef} />
            </div>
          </div>
          <div>
            <div className="upload-section">
              <UploadVedio />
            </div>
          </div>
        </div>
      </div>
      {/* <svg
        style={{
          margin: "auto",
          background: "#f1f2f3",
          display: "block",
          zIndex: 1,
          position: "relative",
        }}
        width="1536"
        height="739"
        viewBox="0 0 1536 739"
        preserveAspectRatio="xMidYMid"
      >
        <g transform="translate(768,369.5) scale(1,1) translate(-768,-369.5)">
          <linearGradient
            id="lg-0.17752199568620242"
            x1="0"
            x2="1"
            y1="0"
            y2="0"
          >
            <stop stopColor="#ec1c24" offset="0"></stop>
            <stop stopColor="#fdbd10" offset="1"></stop>
          </linearGradient>
          <path d="" fill="url(#lg-0.17752199568620242)" opacity="0.4">
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              keyTimes="0;0.333;0.667;1"
              calcMode="spline"
              keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
              begin="0s"
              values="M0 0L 0 672.753459646721Q 153.6 712.8896941540886  307.2 683.3945652306439T 614.4 569.4889613509381T 921.6 524.7360474273025T 1228.8 569.5416765654713T 1536 547.0939707270614L 1536 0 Z;M0 0L 0 632.0918470327906Q 153.6 621.2849013951103  307.2 593.5759886348307T 614.4 590.5754270686137T 921.6 638.9519994077305T 1228.8 551.6515508563098T 1536 555.4960785311282L 1536 0 Z;M0 0L 0 655.7027868865584Q 153.6 638.8175534048048  307.2 610.5358645468074T 614.4 638.0021958008354T 921.6 614.2081435753915T 1228.8 571.5211648127862T 1536 452.45932000205266L 1536 0 Z;M0 0L 0 672.753459646721Q 153.6 712.8896941540886  307.2 683.3945652306439T 614.4 569.4889613509381T 921.6 524.7360474273025T 1228.8 569.5416765654713T 1536 547.0939707270614L 1536 0 Z"
            ></animate>
          </path>
          <path d="" fill="url(#lg-0.17752199568620242)" opacity="0.4">
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              keyTimes="0;0.333;0.667;1"
              calcMode="spline"
              keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
              begin="-3.3333333333333335s"
              values="M0 0L 0 691.0947763436462Q 153.6 671.0152409265202  307.2 650.6399852254787T 614.4 619.5604282087985T 921.6 558.5329281642112T 1228.8 503.3616069213661T 1536 552.1537742445137L 1536 0 Z;M0 0L 0 626.330179374798Q 153.6 610.1926329269339  307.2 583.0519330904098T 614.4 668.0693173424972T 921.6 624.5289408211345T 1228.8 496.95215744920444T 1536 486.43418944509637L 1536 0 Z;M0 0L 0 608.5673633540712Q 153.6 704.0537148715707  307.2 670.1430460818468T 614.4 545.0482752370792T 921.6 546.2507393335916T 1228.8 487.8975342163203T 1536 536.2147272667678L 1536 0 Z;M0 0L 0 691.0947763436462Q 153.6 671.0152409265202  307.2 650.6399852254787T 614.4 619.5604282087985T 921.6 558.5329281642112T 1228.8 503.3616069213661T 1536 552.1537742445137L 1536 0 Z"
            ></animate>
          </path>
          <path d="" fill="url(#lg-0.17752199568620242)" opacity="0.4">
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              keyTimes="0;0.333;0.667;1"
              calcMode="spline"
              keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
              begin="-6.666666666666667s"
              values="M0 0L 0 602.6609564496387Q 153.6 650.8808766325706  307.2 621.1274465519409T 614.4 576.0294345888145T 921.6 544.7478981743393T 1228.8 515.3775180035652T 1536 455.24276735757877L 1536 0 Z;M0 0L 0 710.2488110520528Q 153.6 639.0120567927247  307.2 619.7663844045019T 614.4 567.71513610482T 921.6 630.3752413180116T 1228.8 537.8635141734106T 1536 561.5779475848462L 1536 0 Z;M0 0L 0 664.4803383049918Q 153.6 626.0370200759604  307.2 591.0364768809367T 614.4 651.0419987616143T 921.6 643.6073759255124T 1228.8 579.6948877320726T 1536 575.4603275820558L 1536 0 Z;M0 0L 0 602.6609564496387Q 153.6 650.8808766325706  307.2 621.1274465519409T 614.4 576.0294345888145T 921.6 544.7478981743393T 1228.8 515.3775180035652T 1536 455.24276735757877L 1536 0 Z"
            ></animate>
          </path>
        </g>
      </svg> */}
    </>
  );
};

export default Home;
