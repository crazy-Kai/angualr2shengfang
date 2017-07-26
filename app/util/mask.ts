export class Mask{
	private interval: any;

	show(){
		let el = document.getElementById('mask');
		
		if(el){
			el.style.display = 'block';
		}else{
			el = this.createMaskWrap();
			
			let tip = this.createMaskTip();

			el.appendChild(tip);

			let time = 1,
				doc = 'Loading';
			tip.innerHTML = doc;
			this.interval = setInterval(function(){
				tip.innerHTML = doc;
				if(time < 4){
					for(let i=0; i<time; i++){
						tip.innerHTML += '.';
					}
					time++;
				}else{
					time = 1;
				}
			},200);

			document.body.appendChild(el);
		}
	}

	createMaskWrap(){
		let el = document.createElement('div');

		el.id = 'mask';
		el.style.display = 'block';
		el.style.position = 'fixed';
		el.style.left = '0';
		el.style.right = '0';
		el.style.top = '0';
		el.style.bottom = '0';
		el.style.zIndex = '9999';
		el.style.backgroundColor = 'rgba(0,0,0,.45)';

		return el;
	}

	createMaskTip(){
		let tip = document.createElement('div');

		tip.style.color = '#fff';
	    tip.style.background = 'rgba(255,255,255,.4)';
	    tip.style.padding = '10px 20px';
	    tip.style.position = 'fixed';
	    tip.style.left = '50%';
	    tip.style.top = '50%';
	    tip.style.borderRadius = '4px';
	    tip.style.width = '300px';
	    tip.style.height = '50px';
	    tip.style.lineHeight = '30px';
	    tip.style.textAlign = 'center';
	    tip.style.fontSize = '26px';
	    tip.style.marginLeft = '-150px';
    	tip.style.marginTop = '-25px';
    	tip.style.letterSpacing = '2px';
    	tip.style.fontWeight = 'bold';
    	// tip.style.boxShadow = '0 0 20px #fff';

	    return tip;
	}

	close(){
		let el = document.getElementById('mask');

		clearInterval(this.interval);

		if(el){
			el.style.display = 'none';
		}else{
			
		}
	}
}