import { useState, useEffect } from 'react';
import ColorPanel from "./components/ColorPanel";

function App() {

  const [color1,setColor1] = useState<[number,number,number]>([255,250,250]);
  const [color2,setColor2] = useState<[number,number,number]>([12,10,9]);

  const [contrast,setContrast] = useState<number>(0);
  const [standards,setStandards] = useState<boolean[]>([true,true,true,true,true]);

  const [revert,setRevert] = useState<boolean>(false);

  const getContrast = (a: [number,number,number],b: [number,number,number]) => {
    let c = 1;
      if(luminance(...a) > luminance(...b)){
        c = ((luminance(...a) + 0.05 ) / ( luminance(...b) + 0.05 ) );
      }else if(luminance(...a) < luminance(...b)){
        c = ((luminance(...b) + 0.05 ) / ( luminance(...a) + 0.05 ) );
      }else{
      }
    return Math.round(c*100)/100;
  }

  const luminance = (R: number,G: number,B: number) => {
    return Math.round(((0.2126 * linear(R/255) + 0.7152 * linear(G/255) + 0.0722 * linear(B/255)))*100)/100;
  }

  const linear = (n: number) => {
    let nog = 0;
      if (n <= 0.04045) {
          nog = n / 12.92;
      } else {
          nog = Math.pow((n + 0.055) / 1.055, 2.4);
      }
      return nog;
  }

  useEffect(()=>{
    setContrast(getContrast(color1,color2));
  },[]);

  useEffect(()=>{
    setContrast(getContrast(color1,color2));
    setStandards(getStandards(contrast));
  },[color1,color2,contrast]);

  const getStandards = (contrast: number) => {
    const AALarge = passes(contrast,3);
    const AASmall = passes(contrast,4.5);
    const GFX = passes(contrast,3);
    const AAALarge = passes(contrast,4.5);
    const AAASmall = passes(contrast,7);
    return [AALarge,AASmall,GFX,AAALarge,AAASmall]; 
  } 

  const passes = (n: number,s: number) => {
    if(n > s){
      return true;
    }else{
      return false;
    }
  }

  const StandardInfo = (props: {name: string, standard: boolean}) => {
    const {name,standard} = props;
    return(
      <div className="flex flex-wrap lg:flex-nowrap items-center p-1">
        <div className="w-32">
          {name}
        </div>
        <div className="w-full">
            {standard ? 
            <p className="bg-green-200 text-green-800 rounded-full border border-green-800 w-32 text-xs p-1 px-4 text-center font-bold uppercase tracking-widest">Approved</p> : 
            <p className="bg-red-200 text-red-800 rounded-full border border-red-800 w-32 text-xs p-1 px-4 text-center font-bold uppercase tracking-widest">Failed</p>}
        </div>
      </div>
    )
  }

  const swap = () => {
    let temp1 = color2;
    let temp2 = color1;
    setColor1(temp1);
    setColor2(temp2);
    setRevert(!revert);
  }

  const onColorChange = (color: [number,number,number],place: number) => {
    if(place === 1){
      setColor1(color);
    }else{
      setColor2(color);
    }
  }

  return (
    <div className="bg-stone-300" style={{transition: "0.3s", backgroundColor: `rgba(${color1[0]},${color1[1]},${color1[2]},1)`}}>
      <div className="container m-auto w-full min-h-screen flex">
        <div className="w-full">
          <div className="">
            <div className="w-full p-8 flex items-center text-center justify-center">
              <div className="py-16">
                <h3 className="font-['Recoleta'] text-5xl" style={{transition: "0.3s", color: `rgba(${color2[0]},${color2[1]},${color2[2]},1)`}}>Large Text</h3>
                <p className="py-6" style={{transition: "0.3s", color: `rgba(${color2[0]},${color2[1]},${color2[2]},1)`}}>Smaller or "Normal" text. Also consider that the text in the Graphical Element below is treated as normal text in relation to the element itself.</p>
                <a className="my-2 p-2 px-4 rounded-md" style={{transition: "0.3s", color: `rgba(${color1[0]},${color1[1]},${color1[2]},1)`, backgroundColor: `rgba(${color2[0]},${color2[1]},${color2[2]},1)`}}>Graphical Element</a>
              </div>
            </div>
          </div>
          <div className="w-full bg-white border border-stone-300 lg:rounded-md shadow-md overflow-hidden">
            <div className="flex flex-wrap lg:flex-nowrap p-4 rounded-md">
              <div className="w-32 py-3 text-center flex items-center text-center">
                <div className="w-full">
                  <p className="text-base">Contrast</p><p className="text-5xl font-semibold">{contrast}</p>
                </div>
              </div>
              <div className="w-full flex justify-center relative py-4">
                <div className="w-full">
                  <p className="text-sm font-bold py-1">Normal Text</p>
                  <StandardInfo standard={standards[1]} name="WCAG AA"/>
                  <StandardInfo standard={standards[4]} name="WCAG AAA"/>
                </div>
                <div className="w-full">
                  <p className="text-sm font-bold py-1">Large Text</p>
                  <StandardInfo standard={standards[0]} name="WCAG AA"/>
                  <StandardInfo standard={standards[3]} name="WCAG AAA"/>
                </div>
                <div className="w-full">
                  <p className="text-sm font-bold py-1">Graphics</p>
                  <StandardInfo standard={standards[2]} name="WCAG AA"/>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap lg:flex-nowrap w-full relative items-center justify-center">
              <button onClick={()=>{swap();}} className="absolute z-10 bg-stone-950 p-2 px-3 rounded-md border border-stone-900 text-stone-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                  <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
                  <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
                </svg>
              </button>
              <ColorPanel title="Background Color" onColorChange={onColorChange} number={1} defol={color1} revert={revert}/>
              <ColorPanel title="Foreground Color" onColorChange={onColorChange} number={2} defol={color2} revert={revert}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
