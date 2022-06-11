$(function() {
    setFrameSRC();
    console.log("sets display");



  
      
});

function myFunction(event) {
    console.log("clicks", event.target.parentElement);
    var dots = event.target.parentElement.getElementsByClassName("dots")[0];
    var moreText = event.target.parentElement.getElementsByClassName("more")[0];
    var btnText = event.target.parentElement.getElementsByClassName("myBtn")[0];

    let otherContainers = event.target.parentElement.parentElement.getElementsByClassName("content_chapter");;

    console.log(otherContainers);
    for (let index = 0; index < otherContainers.length; index++) {
       
        const element = otherContainers[index];
        if(element != event.target.parentElement){
         
            var dots2 = element.getElementsByClassName("dots")[0];
            var moreText2 = element.getElementsByClassName("more")[0];
            var btnText2 = element.getElementsByClassName("myBtn")[0];

            console.log("FINDS ELEMENTS TO UNFOLD", index, element);

            if (dots2.style.display === "none") {
                dots2.style.display = "inline";
                btnText2.innerHTML = "MORE...";
                moreText2.style.display = "none";
                btnText2.style.marginTop = "1em";
            } 

            element.style.height = "15%";
            element.getElementsByClassName("textcontainer")[0].style.display = "none";
            element.getElementsByClassName("content_chapter_headline")[0].style.marginBottom = "0";
            btnText2.style.margin = "0";

        }   
    }
        
    

    if (dots.style.display === "none") {
        dots.style.display = "inline";
        btnText.innerHTML = "MORE...";
        moreText.style.display = "none";

        for (let index = 0; index < otherContainers.length; index++) {
       
            const element = otherContainers[index];
            var isUnfolded = true;
            if(element != event.target.parentElement){
                var dots2 = element.getElementsByClassName("dots")[0];
                var btnText2 = element.getElementsByClassName("myBtn")[0];
                if (dots2.style.display != "none") {
                    element.style.height = "33%";
                    element.getElementsByClassName("textcontainer")[0].style.display = "block";
                    element.getElementsByClassName("content_chapter_headline")[0].style.marginBottom = "1em";
                    btnText2.style.marginTop = "1em";



                    isUnfolded = false;

                } 
    
            }   
        }
   
        event.target.parentElement.style.height = "33%";
        btnText.style.marginTop = "1em";
                



        




    } else {
        dots.style.display = "none";
        btnText.innerHTML = "LESS";
        btnText.style.marginTop = "1em";

        moreText.style.display = "inline";
        event.target.parentElement.getElementsByClassName("content_chapter_headline")[0].style.marginBottom = "1em";
        event.target.parentElement.style.height = "70%";
        event.target.parentElement.getElementsByClassName("textcontainer")[0].style.display = "block";


    }
}


let c = document.getElementById("display"); 
let noiseMachine;
let pos = 0;

window.addEventListener('resize', function(event){
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight; 


    c.style.width = newWidth;
    c.style.height = newHeight;

    if($('.frame-border')){
        setFrameSRC();
    }
});




function setFrameSRC(){
    console.log("changes frame");
    if($(window).innerWidth() < 1100){

        $('.desktop').css({"display":"none"})
        $('.mobile').css({"display":"block"})

    } else {
        // $('.frame-border').attr("src","./reboot_img/frame-elements/frame.png");
        $('.desktop').css({"display":"block"})
        $('.mobile').css({"display":"none"})
    }
};

function run(){
    let stage = new createjs.Stage("display"); 

    noiseMachine = new PerlinNoiseMachine();
  
    createjs.Ticker.on("tick", handleTick);    
}

function handleTick(e){
//   let c = document.getElementById("display"); 
    let ctx = c.getContext("2d");
    let imgData = ctx.getImageData(0,0,c.width, c.height);

    for(let i = 0; i < c.width*c.height; i++){
        let x = i % c.width;
        let y = (i-x)/c.width;
        let density = 6/100; //size
        let offsetRed = 24;
        let offsetGreen = 0;
        let offsetBlue = 0.5;
        pos += 0.000001; ///time+speed
        let r = noiseMachine.noise(x*density, y*density, offsetRed + pos*density);
        let g = noiseMachine.noise(x*density, y*density, offsetGreen + pos*density*2);
        let b = noiseMachine.noise(x*density, y*density, offsetBlue + pos*density*0.5);
        imgData.data[4*i   ] = r*255 | 0; //r
        imgData.data[4*i +1] = g*255 | 0; //g
        imgData.data[4*i +2] = b*255 | 0; //b
        imgData.data[4*i +3] = 255;   //a
    }

    ctx.putImageData(imgData, 0, 0);
}

class PerlinNoiseMachine {

    constructor(){

        this.permutation = new Uint8Array(512);

        for(let i = 0; i < 256; i++){
            this.permutation[i] = i;
        }

        // Fisher-Yates shuffle the array, and double it
        for(let i = 255; i > 0; i--){
            let swapIndex = (Math.random() * i) | 0;

            let temp = this.permutation[i];
            this.permutation[i] = this.permutation[swapIndex];
            this.permutation[swapIndex] = temp;
            this.permutation[swapIndex+255] = temp;
        }
    }

    noise(x, y = 0, z = 0){
        let cubeX   = (x | 0) & 255, cubeY   = (y | 0) & 255, cubeZ   = (z | 0) & 255;            // which 'unit cube' this point lies on
        let offsetX = x - (x | 0),   offsetY = y - (y | 0),   offsetZ = z - (z | 0);  // The point's location in that cube

        // Smoothing function:
        let u = this.fade(offsetX);
        let v = this.fade(offsetY);
        let w = this.fade(offsetZ);

        let p = this.permutation;

        // Hash all eight corners of the cube down to a single value using our precomputed permutation
        let aaa = p[p[p[ cubeX     ]+ cubeY     ]+ cubeZ     ];
        let aba = p[p[p[ cubeX     ]+ cubeY + 1 ]+ cubeZ     ];
        let aab = p[p[p[ cubeX     ]+ cubeY     ]+ cubeZ + 1 ];
        let abb = p[p[p[ cubeX     ]+ cubeY + 1 ]+ cubeZ + 1 ];
        let baa = p[p[p[ cubeX + 1 ]+ cubeY     ]+ cubeZ     ];
        let bba = p[p[p[ cubeX + 1 ]+ cubeY + 1 ]+ cubeZ     ];
        let bab = p[p[p[ cubeX + 1 ]+ cubeY     ]+ cubeZ + 1 ];
        let bbb = p[p[p[ cubeX + 1 ]+ cubeY + 1 ]+ cubeZ + 1 ];

        let gr = this.gradient;

        // Generate noise from the input. The gr function takes the hashed corner values and turns them into a
        // vector, then dot products that vector with the rest of the input, which in this case are the vectors from the
        // user-provided point to the corners of the unit cube it sits in.
        let x1 = this.lerp(   gr(aaa, offsetX, offsetY  , offsetZ), gr(baa, offsetX-1, offsetY  , offsetZ), u   );
        let x2 = this.lerp(   gr(aba, offsetX, offsetY-1, offsetZ), gr(bba, offsetX-1, offsetY-1, offsetZ), u   );
        let y1 = this.lerp(x1, x2, v);

        x1     = this.lerp(   gr(aab, offsetX, offsetY  , offsetZ-1), gr(bab, offsetX-1, offsetY  , offsetZ-1), u   );
        x2     = this.lerp(   gr(abb, offsetX, offsetY-1, offsetZ-1), gr(bbb, offsetX-1, offsetY-1, offsetZ-1), u   );
        let y2 = this.lerp(x1, x2, v);

        let out = this.lerp(y1, y2, w);

        // Normalize to 0-1, as the above output can be -1 to 1
        return (out+1)/2
    }

    fade(t){
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(a, b, x){
        return a + x * (b - a);
    }

    /**
     * Returns the dot product of the vector x,y,z with a pseudorandomly chosen vector from the list:
     * (1,1,0),(-1,1,0),(1,-1,0),(-1,-1,0),
     * (1,0,1),(-1,0,1),(1,0,-1),(-1,0,-1),
     * (0,1,1),(0,-1,1),(0,1,-1),(0,-1,-1)
     * based on the hash provided.
     * @param hash The hash to use to determine which vector is used in the dot product.
     * @param x
     * @param y
     * @param z
     */
    gradient(hash, x, y , z){
        switch(hash & 0xF) {
            case 0x0: return  x + y;
            case 0x1: return -x + y;
            case 0x2: return  x - y;
            case 0x3: return -x - y;
            case 0x4: return  x + z;
            case 0x5: return -x + z;
            case 0x6: return  x - z;
            case 0x7: return -x - z;
            case 0x8: return  y + z;
            case 0x9: return -y + z;
            case 0xA: return  y - z;
            case 0xB: return -y - z;
            case 0xC: return  y + x;
            case 0xD: return -y + z;
            case 0xE: return  y - x;
            case 0xF: return -y - z;
            default: return 0; // never happens
        }
    }
}

run();