import {useState,useEffect, useRef} from "react";
import convert from "color-convert";

import tailwindColors from 'tailwindcss/colors';

const ColorPanel = (props: {onColorChange: Function, number: number, defol: [number,number,number], revert: boolean, title: string}) => {
	const {onColorChange,number,defol,revert, title} = props;
	const [color,setColor] = useState<[number,number,number]>(defol);
	const [openTW,setOpenTW] = useState<boolean>(false);

	const textInput = useRef<any>();

	const handleHSL = (val: number,index: number) => {
		let temp = convert.rgb.hsl(color);
		temp[index] = val;
		setColor(convert.hsl.rgb(temp));
	}

	const handleTWColor = (value: [number,number,number]) => {
		setColor(value);
		setOpenTW(false);
	}

	useEffect(()=>{
		onColorChange(color,number);
	},[color]);

	useEffect(()=>{
			setColor(defol);
	},[revert]);

	useEffect(()=>{
		if(textInput.current){
			textInput.current.value = convert.rgb.hex(color);
		}
	},[color]);

	return(
      <div className="flex w-full items-center p-4 justify-center">
        <div className="w-full px-2 lg:px-10">
        	<div className="flex">
        		<div className="w-full">
        			<p className="font-bold py-3 text-lg">{title}</p>
        		</div>
        		<div className="w-full text-end">
          		<p onClick={()=>{setOpenTW(!openTW)}} className="cursor-pointer my-3 bg-stone-600 text-stone-50 rounded-md p-2 px-3 text-xs font-bold inline-block w-28 text-center">{!openTW ? <>Tailwind Colors</> : <>Color Panel</>}</p>
        		</div>
        	</div>
        	<div className={`min-h-40 ${!openTW ? "block" : "hidden"}`}>
	          <div className="flex items-center">
	            <input ref={textInput} type="text" className="p-2 px-3 rounded-lg border border-stone-300" defaultValue={convert.rgb.hex([...color])} onBlur={(val)=>{setColor(convert.hex.rgb(val.target.value))}}/>
	            <input type="color" className="m-2" value={`#${convert.rgb.hex([...color])}`} onChange={(val)=>{setColor(convert.hex.rgb(val.target.value))}}/>
	          </div>
	          <div className="py-3">
		          <div className="flex items-center py-1">
		          	<p className="w-24 text-xs">Hue</p>
		            <input type="range" className="w-full" value={convert.rgb.hsl(color)[0]} onChange={(val)=>{handleHSL(parseInt(val.target.value),0)}} min="0" max="255"/>
		          </div>
		          <div className="flex items-center py-1">
		          	<p className="w-24 text-xs">Saturation</p>
		            <input type="range" className="w-full" value={convert.rgb.hsl(color)[1]} onChange={(val)=>{handleHSL(parseInt(val.target.value),1)}} min="0" max="100"/>
		          </div>
		          <div className="flex items-center py-1">
		          	<p className="w-24 text-xs">Lightness</p>
		            <input type="range" className="w-full" value={convert.rgb.hsl(color)[2]} onChange={(val)=>{handleHSL(parseInt(val.target.value),2)}} min="0" max="100"/>
		          </div>
	          </div>
          </div>
          <div className="">
          	<div className={`overflow-y-scroll max-h-40 p-2 py-4 rounded-md ${openTW ? "block" : "hidden"}`}>
          		{Object.entries(tailwindColors).slice(5,Object.keys(tailwindColors).length -4).map((tColor,key: number)=>
          			<div key={key} className="flex items-center py-2"><p className="w-32 text-xs uppercase text-stone-500 tracking-widest">{tColor[0]}</p>
          			<div>{Object.values(tColor[1]).map((value: any,key)=><div key={key} className="inline-block cursor-pointer" onClick={()=>{handleTWColor(convert.hex.rgb(value))}}><div className={`w-8 h-8 mr-2 rounded-md`} style={{backgroundColor: value}}></div></div>)}</div></div>
          		)}
          	</div>
          </div>
        </div>
      </div>
	)
}
export default ColorPanel;