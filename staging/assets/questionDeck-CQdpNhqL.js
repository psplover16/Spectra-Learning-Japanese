import{d as Ke,c as je,b as F,t as G,o as le,y as Gt,x as j,O as en,A as tn,D as an,e as Se,f as lt,n as Ae,a as ft,_ as ut,w as ct,T as nn,g as dt}from"./index-DLnbD2S1.js";const rn={class:"inline-flex cursor-pointer items-center gap-2 text-sm text-ink"},on=["checked"],Ko=Ke({__name:"BaseCheckbox",props:{modelValue:{type:Boolean},label:{}},emits:["update:modelValue"],setup(e,{emit:t}){const a=e,n=t;return(r,i)=>(le(),je("label",rn,[F("input",{class:"h-4 w-4 rounded border-clay/40 text-clay focus:ring-clay",type:"checkbox",checked:a.modelValue,onChange:i[0]||(i[0]=o=>n("update:modelValue",o.target.checked))},null,40,on),F("span",null,G(e.label),1)]))}});function Ne(e,t){(t==null||t>e.length)&&(t=e.length);for(var a=0,n=Array(t);a<t;a++)n[a]=e[a];return n}function sn(e){if(Array.isArray(e))return e}function ln(e){if(Array.isArray(e))return Ne(e)}function fn(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function un(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,Xt(n.key),n)}}function cn(e,t,a){return t&&un(e.prototype,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function fe(e,t){var a=typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(!a){if(Array.isArray(e)||(a=qe(e))||t){a&&(e=a);var n=0,r=function(){};return{s:r,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(l){throw l},f:r}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var i,o=!0,s=!1;return{s:function(){a=a.call(e)},n:function(){var l=a.next();return o=l.done,l},e:function(l){s=!0,i=l},f:function(){try{o||a.return==null||a.return()}finally{if(s)throw i}}}}function g(e,t,a){return(t=Xt(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function dn(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function mn(e,t){var a=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(a!=null){var n,r,i,o,s=[],l=!0,u=!1;try{if(i=(a=a.call(e)).next,t===0){if(Object(a)!==a)return;l=!1}else for(;!(l=(n=i.call(a)).done)&&(s.push(n.value),s.length!==t);l=!0);}catch(c){u=!0,r=c}finally{try{if(!l&&a.return!=null&&(o=a.return(),Object(o)!==o))return}finally{if(u)throw r}}return s}}function vn(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function hn(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function mt(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),a.push.apply(a,n)}return a}function f(e){for(var t=1;t<arguments.length;t++){var a=arguments[t]!=null?arguments[t]:{};t%2?mt(Object(a),!0).forEach(function(n){g(e,n,a[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):mt(Object(a)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))})}return e}function ge(e,t){return sn(e)||mn(e,t)||qe(e,t)||vn()}function _(e){return ln(e)||dn(e)||qe(e)||hn()}function gn(e,t){if(typeof e!="object"||!e)return e;var a=e[Symbol.toPrimitive];if(a!==void 0){var n=a.call(e,t);if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function Xt(e){var t=gn(e,"string");return typeof t=="symbol"?t:t+""}function de(e){"@babel/helpers - typeof";return de=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},de(e)}function qe(e,t){if(e){if(typeof e=="string")return Ne(e,t);var a={}.toString.call(e).slice(8,-1);return a==="Object"&&e.constructor&&(a=e.constructor.name),a==="Map"||a==="Set"?Array.from(e):a==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?Ne(e,t):void 0}}var vt=function(){},Je={},Vt={},Kt=null,qt={mark:vt,measure:vt};try{typeof window<"u"&&(Je=window),typeof document<"u"&&(Vt=document),typeof MutationObserver<"u"&&(Kt=MutationObserver),typeof performance<"u"&&(qt=performance)}catch{}var pn=Je.navigator||{},ht=pn.userAgent,gt=ht===void 0?"":ht,L=Je,x=Vt,pt=Kt,oe=qt;L.document;var D=!!x.documentElement&&!!x.head&&typeof x.addEventListener=="function"&&typeof x.createElement=="function",Jt=~gt.indexOf("MSIE")||~gt.indexOf("Trident/"),ke,yn=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,bn=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i,Qt={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"},slab:{"fa-regular":"regular",faslr:"regular"},"slab-press":{"fa-regular":"regular",faslpr:"regular"},thumbprint:{"fa-light":"light",fatl:"light"},whiteboard:{"fa-semibold":"semibold",fawsb:"semibold"},notdog:{"fa-solid":"solid",fans:"solid"},"notdog-duo":{"fa-solid":"solid",fands:"solid"},etch:{"fa-solid":"solid",faes:"solid"},graphite:{"fa-thin":"thin",fagt:"thin"},jelly:{"fa-regular":"regular",fajr:"regular"},"jelly-fill":{"fa-regular":"regular",fajfr:"regular"},"jelly-duo":{"fa-regular":"regular",fajdr:"regular"},chisel:{"fa-regular":"regular",facr:"regular"},utility:{"fa-semibold":"semibold",fausb:"semibold"},"utility-duo":{"fa-semibold":"semibold",faudsb:"semibold"},"utility-fill":{"fa-semibold":"semibold",faufsb:"semibold"}},xn={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},Zt=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],k="classic",ne="duotone",ea="sharp",ta="sharp-duotone",aa="chisel",na="etch",ra="graphite",ia="jelly",oa="jelly-duo",sa="jelly-fill",la="notdog",fa="notdog-duo",ua="slab",ca="slab-press",da="thumbprint",ma="utility",va="utility-duo",ha="utility-fill",ga="whiteboard",wn="Classic",Sn="Duotone",An="Sharp",kn="Sharp Duotone",Pn="Chisel",In="Etch",On="Graphite",En="Jelly",Fn="Jelly Duo",Cn="Jelly Fill",_n="Notdog",jn="Notdog Duo",Nn="Slab",Tn="Slab Press",$n="Thumbprint",Mn="Utility",Dn="Utility Duo",Ln="Utility Fill",zn="Whiteboard",pa=[k,ne,ea,ta,aa,na,ra,ia,oa,sa,la,fa,ua,ca,da,ma,va,ha,ga];ke={},g(g(g(g(g(g(g(g(g(g(ke,k,wn),ne,Sn),ea,An),ta,kn),aa,Pn),na,In),ra,On),ia,En),oa,Fn),sa,Cn),g(g(g(g(g(g(g(g(g(ke,la,_n),fa,jn),ua,Nn),ca,Tn),da,$n),ma,Mn),va,Dn),ha,Ln),ga,zn);var Rn={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"},slab:{400:"faslr"},"slab-press":{400:"faslpr"},whiteboard:{600:"fawsb"},thumbprint:{300:"fatl"},notdog:{900:"fans"},"notdog-duo":{900:"fands"},etch:{900:"faes"},graphite:{100:"fagt"},chisel:{400:"facr"},jelly:{400:"fajr"},"jelly-fill":{400:"fajfr"},"jelly-duo":{400:"fajdr"},utility:{600:"fausb"},"utility-duo":{600:"faudsb"},"utility-fill":{600:"faufsb"}},Wn={"Font Awesome 7 Free":{900:"fas",400:"far"},"Font Awesome 7 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 7 Brands":{400:"fab",normal:"fab"},"Font Awesome 7 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 7 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 7 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"},"Font Awesome 7 Jelly":{400:"fajr",normal:"fajr"},"Font Awesome 7 Jelly Fill":{400:"fajfr",normal:"fajfr"},"Font Awesome 7 Jelly Duo":{400:"fajdr",normal:"fajdr"},"Font Awesome 7 Slab":{400:"faslr",normal:"faslr"},"Font Awesome 7 Slab Press":{400:"faslpr",normal:"faslpr"},"Font Awesome 7 Thumbprint":{300:"fatl",normal:"fatl"},"Font Awesome 7 Notdog":{900:"fans",normal:"fans"},"Font Awesome 7 Notdog Duo":{900:"fands",normal:"fands"},"Font Awesome 7 Etch":{900:"faes",normal:"faes"},"Font Awesome 7 Graphite":{100:"fagt",normal:"fagt"},"Font Awesome 7 Chisel":{400:"facr",normal:"facr"},"Font Awesome 7 Whiteboard":{600:"fawsb",normal:"fawsb"},"Font Awesome 7 Utility":{600:"fausb",normal:"fausb"},"Font Awesome 7 Utility Duo":{600:"faudsb",normal:"faudsb"},"Font Awesome 7 Utility Fill":{600:"faufsb",normal:"faufsb"}},Un=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["chisel",{defaultShortPrefixId:"facr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["etch",{defaultShortPrefixId:"faes",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["graphite",{defaultShortPrefixId:"fagt",defaultStyleId:"thin",styleIds:["thin"],futureStyleIds:[],defaultFontWeight:100}],["jelly",{defaultShortPrefixId:"fajr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-duo",{defaultShortPrefixId:"fajdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-fill",{defaultShortPrefixId:"fajfr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["notdog",{defaultShortPrefixId:"fans",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog-duo",{defaultShortPrefixId:"fands",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["slab",{defaultShortPrefixId:"faslr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press",{defaultShortPrefixId:"faslpr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["thumbprint",{defaultShortPrefixId:"fatl",defaultStyleId:"light",styleIds:["light"],futureStyleIds:[],defaultFontWeight:300}],["utility",{defaultShortPrefixId:"fausb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-duo",{defaultShortPrefixId:"faudsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-fill",{defaultShortPrefixId:"faufsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["whiteboard",{defaultShortPrefixId:"fawsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}]]),Bn={chisel:{regular:"facr"},classic:{brands:"fab",light:"fal",regular:"far",solid:"fas",thin:"fat"},duotone:{light:"fadl",regular:"fadr",solid:"fad",thin:"fadt"},etch:{solid:"faes"},graphite:{thin:"fagt"},jelly:{regular:"fajr"},"jelly-duo":{regular:"fajdr"},"jelly-fill":{regular:"fajfr"},notdog:{solid:"fans"},"notdog-duo":{solid:"fands"},sharp:{light:"fasl",regular:"fasr",solid:"fass",thin:"fast"},"sharp-duotone":{light:"fasdl",regular:"fasdr",solid:"fasds",thin:"fasdt"},slab:{regular:"faslr"},"slab-press":{regular:"faslpr"},thumbprint:{light:"fatl"},utility:{semibold:"fausb"},"utility-duo":{semibold:"faudsb"},"utility-fill":{semibold:"faufsb"},whiteboard:{semibold:"fawsb"}},ya=["fak","fa-kit","fakd","fa-kit-duotone"],yt={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},Yn=["kit"],Hn="kit",Gn="kit-duotone",Xn="Kit",Vn="Kit Duotone";g(g({},Hn,Xn),Gn,Vn);var Kn={kit:{"fa-kit":"fak"}},qn={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},Jn={kit:{fak:"fa-kit"}},bt={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},Pe,se={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},Qn=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],Zn="classic",er="duotone",tr="sharp",ar="sharp-duotone",nr="chisel",rr="etch",ir="graphite",or="jelly",sr="jelly-duo",lr="jelly-fill",fr="notdog",ur="notdog-duo",cr="slab",dr="slab-press",mr="thumbprint",vr="utility",hr="utility-duo",gr="utility-fill",pr="whiteboard",yr="Classic",br="Duotone",xr="Sharp",wr="Sharp Duotone",Sr="Chisel",Ar="Etch",kr="Graphite",Pr="Jelly",Ir="Jelly Duo",Or="Jelly Fill",Er="Notdog",Fr="Notdog Duo",Cr="Slab",_r="Slab Press",jr="Thumbprint",Nr="Utility",Tr="Utility Duo",$r="Utility Fill",Mr="Whiteboard";Pe={},g(g(g(g(g(g(g(g(g(g(Pe,Zn,yr),er,br),tr,xr),ar,wr),nr,Sr),rr,Ar),ir,kr),or,Pr),sr,Ir),lr,Or),g(g(g(g(g(g(g(g(g(Pe,fr,Er),ur,Fr),cr,Cr),dr,_r),mr,jr),vr,Nr),hr,Tr),gr,$r),pr,Mr);var Dr="kit",Lr="kit-duotone",zr="Kit",Rr="Kit Duotone";g(g({},Dr,zr),Lr,Rr);var Wr={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"},slab:{"fa-regular":"faslr"},"slab-press":{"fa-regular":"faslpr"},whiteboard:{"fa-semibold":"fawsb"},thumbprint:{"fa-light":"fatl"},notdog:{"fa-solid":"fans"},"notdog-duo":{"fa-solid":"fands"},etch:{"fa-solid":"faes"},graphite:{"fa-thin":"fagt"},jelly:{"fa-regular":"fajr"},"jelly-fill":{"fa-regular":"fajfr"},"jelly-duo":{"fa-regular":"fajdr"},chisel:{"fa-regular":"facr"},utility:{"fa-semibold":"fausb"},"utility-duo":{"fa-semibold":"faudsb"},"utility-fill":{"fa-semibold":"faufsb"}},Ur={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"],slab:["faslr"],"slab-press":["faslpr"],whiteboard:["fawsb"],thumbprint:["fatl"],notdog:["fans"],"notdog-duo":["fands"],etch:["faes"],graphite:["fagt"],jelly:["fajr"],"jelly-fill":["fajfr"],"jelly-duo":["fajdr"],chisel:["facr"],utility:["fausb"],"utility-duo":["faudsb"],"utility-fill":["faufsb"]},Te={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"},slab:{faslr:"fa-regular"},"slab-press":{faslpr:"fa-regular"},whiteboard:{fawsb:"fa-semibold"},thumbprint:{fatl:"fa-light"},notdog:{fans:"fa-solid"},"notdog-duo":{fands:"fa-solid"},etch:{faes:"fa-solid"},graphite:{fagt:"fa-thin"},jelly:{fajr:"fa-regular"},"jelly-fill":{fajfr:"fa-regular"},"jelly-duo":{fajdr:"fa-regular"},chisel:{facr:"fa-regular"},utility:{fausb:"fa-semibold"},"utility-duo":{faudsb:"fa-semibold"},"utility-fill":{faufsb:"fa-semibold"}},Br=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands","fa-semibold"],ba=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt","faslr","faslpr","fawsb","fatl","fans","fands","faes","fagt","fajr","fajfr","fajdr","facr","fausb","faudsb","faufsb"].concat(Qn,Br),Yr=["solid","regular","light","thin","duotone","brands","semibold"],xa=[1,2,3,4,5,6,7,8,9,10],Hr=xa.concat([11,12,13,14,15,16,17,18,19,20]),Gr=["aw","fw","pull-left","pull-right"],Xr=[].concat(_(Object.keys(Ur)),Yr,Gr,["2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","inverse","layers","layers-bottom-left","layers-bottom-right","layers-counter","layers-text","layers-top-left","layers-top-right","li","pull-end","pull-start","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul","width-auto","width-fixed",se.GROUP,se.SWAP_OPACITY,se.PRIMARY,se.SECONDARY]).concat(xa.map(function(e){return"".concat(e,"x")})).concat(Hr.map(function(e){return"w-".concat(e)})),Vr={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},$="___FONT_AWESOME___",$e=16,wa="fa",Sa="svg-inline--fa",U="data-fa-i2svg",Me="data-fa-pseudo-element",Kr="data-fa-pseudo-element-pending",Qe="data-prefix",Ze="data-icon",xt="fontawesome-i2svg",qr="async",Jr=["HTML","HEAD","STYLE","SCRIPT"],Aa=["::before","::after",":before",":after"],ka=(function(){try{return!0}catch{return!1}})();function re(e){return new Proxy(e,{get:function(a,n){return n in a?a[n]:a[k]}})}var Pa=f({},Qt);Pa[k]=f(f(f(f({},{"fa-duotone":"duotone"}),Qt[k]),yt.kit),yt["kit-duotone"]);var Qr=re(Pa),De=f({},Bn);De[k]=f(f(f(f({},{duotone:"fad"}),De[k]),bt.kit),bt["kit-duotone"]);var wt=re(De),Le=f({},Te);Le[k]=f(f({},Le[k]),Jn.kit);var et=re(Le),ze=f({},Wr);ze[k]=f(f({},ze[k]),Kn.kit);re(ze);var Zr=yn,Ia="fa-layers-text",ei=bn,ti=f({},Rn);re(ti);var ai=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],Ie=xn,ni=[].concat(_(Yn),_(Xr)),Z=L.FontAwesomeConfig||{};function ri(e){var t=x.querySelector("script["+e+"]");if(t)return t.getAttribute(e)}function ii(e){return e===""?!0:e==="false"?!1:e==="true"?!0:e}if(x&&typeof x.querySelector=="function"){var oi=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-search-pseudo-elements","searchPseudoElements"],["data-search-pseudo-elements-warnings","searchPseudoElementsWarnings"],["data-search-pseudo-elements-full-scan","searchPseudoElementsFullScan"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]];oi.forEach(function(e){var t=ge(e,2),a=t[0],n=t[1],r=ii(ri(a));r!=null&&(Z[n]=r)})}var Oa={styleDefault:"solid",familyDefault:k,cssPrefix:wa,replacementClass:Sa,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};Z.familyPrefix&&(Z.cssPrefix=Z.familyPrefix);var K=f(f({},Oa),Z);K.autoReplaceSvg||(K.observeMutations=!1);var v={};Object.keys(Oa).forEach(function(e){Object.defineProperty(v,e,{enumerable:!0,set:function(a){K[e]=a,ee.forEach(function(n){return n(v)})},get:function(){return K[e]}})});Object.defineProperty(v,"familyPrefix",{enumerable:!0,set:function(t){K.cssPrefix=t,ee.forEach(function(a){return a(v)})},get:function(){return K.cssPrefix}});L.FontAwesomeConfig=v;var ee=[];function si(e){return ee.push(e),function(){ee.splice(ee.indexOf(e),1)}}var H=$e,N={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function li(e){if(!(!e||!D)){var t=x.createElement("style");t.setAttribute("type","text/css"),t.innerHTML=e;for(var a=x.head.childNodes,n=null,r=a.length-1;r>-1;r--){var i=a[r],o=(i.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(o)>-1&&(n=i)}return x.head.insertBefore(t,n),e}}var fi="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function St(){for(var e=12,t="";e-- >0;)t+=fi[Math.random()*62|0];return t}function q(e){for(var t=[],a=(e||[]).length>>>0;a--;)t[a]=e[a];return t}function tt(e){return e.classList?q(e.classList):(e.getAttribute("class")||"").split(" ").filter(function(t){return t})}function Ea(e){return"".concat(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function ui(e){return Object.keys(e||{}).reduce(function(t,a){return t+"".concat(a,'="').concat(Ea(e[a]),'" ')},"").trim()}function pe(e){return Object.keys(e||{}).reduce(function(t,a){return t+"".concat(a,": ").concat(e[a].trim(),";")},"")}function at(e){return e.size!==N.size||e.x!==N.x||e.y!==N.y||e.rotate!==N.rotate||e.flipX||e.flipY}function ci(e){var t=e.transform,a=e.containerWidth,n=e.iconWidth,r={transform:"translate(".concat(a/2," 256)")},i="translate(".concat(t.x*32,", ").concat(t.y*32,") "),o="scale(".concat(t.size/16*(t.flipX?-1:1),", ").concat(t.size/16*(t.flipY?-1:1),") "),s="rotate(".concat(t.rotate," 0 0)"),l={transform:"".concat(i," ").concat(o," ").concat(s)},u={transform:"translate(".concat(n/2*-1," -256)")};return{outer:r,inner:l,path:u}}function di(e){var t=e.transform,a=e.width,n=a===void 0?$e:a,r=e.height,i=r===void 0?$e:r,o="";return Jt?o+="translate(".concat(t.x/H-n/2,"em, ").concat(t.y/H-i/2,"em) "):o+="translate(calc(-50% + ".concat(t.x/H,"em), calc(-50% + ").concat(t.y/H,"em)) "),o+="scale(".concat(t.size/H*(t.flipX?-1:1),", ").concat(t.size/H*(t.flipY?-1:1),") "),o+="rotate(".concat(t.rotate,"deg) "),o}var mi=`:root, :host {
  --fa-font-solid: normal 900 1em/1 'Font Awesome 7 Free';
  --fa-font-regular: normal 400 1em/1 'Font Awesome 7 Free';
  --fa-font-light: normal 300 1em/1 'Font Awesome 7 Pro';
  --fa-font-thin: normal 100 1em/1 'Font Awesome 7 Pro';
  --fa-font-duotone: normal 900 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-regular: normal 400 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-light: normal 300 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-thin: normal 100 1em/1 'Font Awesome 7 Duotone';
  --fa-font-brands: normal 400 1em/1 'Font Awesome 7 Brands';
  --fa-font-sharp-solid: normal 900 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-regular: normal 400 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-light: normal 300 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-thin: normal 100 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-duotone-solid: normal 900 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-regular: normal 400 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-light: normal 300 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-thin: normal 100 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-slab-regular: normal 400 1em/1 'Font Awesome 7 Slab';
  --fa-font-slab-press-regular: normal 400 1em/1 'Font Awesome 7 Slab Press';
  --fa-font-whiteboard-semibold: normal 600 1em/1 'Font Awesome 7 Whiteboard';
  --fa-font-thumbprint-light: normal 300 1em/1 'Font Awesome 7 Thumbprint';
  --fa-font-notdog-solid: normal 900 1em/1 'Font Awesome 7 Notdog';
  --fa-font-notdog-duo-solid: normal 900 1em/1 'Font Awesome 7 Notdog Duo';
  --fa-font-etch-solid: normal 900 1em/1 'Font Awesome 7 Etch';
  --fa-font-graphite-thin: normal 100 1em/1 'Font Awesome 7 Graphite';
  --fa-font-jelly-regular: normal 400 1em/1 'Font Awesome 7 Jelly';
  --fa-font-jelly-fill-regular: normal 400 1em/1 'Font Awesome 7 Jelly Fill';
  --fa-font-jelly-duo-regular: normal 400 1em/1 'Font Awesome 7 Jelly Duo';
  --fa-font-chisel-regular: normal 400 1em/1 'Font Awesome 7 Chisel';
  --fa-font-utility-semibold: normal 600 1em/1 'Font Awesome 7 Utility';
  --fa-font-utility-duo-semibold: normal 600 1em/1 'Font Awesome 7 Utility Duo';
  --fa-font-utility-fill-semibold: normal 600 1em/1 'Font Awesome 7 Utility Fill';
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;function Fa(){var e=wa,t=Sa,a=v.cssPrefix,n=v.replacementClass,r=mi;if(a!==e||n!==t){var i=new RegExp("\\.".concat(e,"\\-"),"g"),o=new RegExp("\\--".concat(e,"\\-"),"g"),s=new RegExp("\\.".concat(t),"g");r=r.replace(i,".".concat(a,"-")).replace(o,"--".concat(a,"-")).replace(s,".".concat(n))}return r}var At=!1;function Oe(){v.autoAddCss&&!At&&(li(Fa()),At=!0)}var vi={mixout:function(){return{dom:{css:Fa,insertCss:Oe}}},hooks:function(){return{beforeDOMElementCreation:function(){Oe()},beforeI2svg:function(){Oe()}}}},M=L||{};M[$]||(M[$]={});M[$].styles||(M[$].styles={});M[$].hooks||(M[$].hooks={});M[$].shims||(M[$].shims=[]);var C=M[$],Ca=[],_a=function(){x.removeEventListener("DOMContentLoaded",_a),me=1,Ca.map(function(t){return t()})},me=!1;D&&(me=(x.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(x.readyState),me||x.addEventListener("DOMContentLoaded",_a));function hi(e){D&&(me?setTimeout(e,0):Ca.push(e))}function ie(e){var t=e.tag,a=e.attributes,n=a===void 0?{}:a,r=e.children,i=r===void 0?[]:r;return typeof e=="string"?Ea(e):"<".concat(t," ").concat(ui(n),">").concat(i.map(ie).join(""),"</").concat(t,">")}function kt(e,t,a){if(e&&e[t]&&e[t][a])return{prefix:t,iconName:a,icon:e[t][a]}}var Ee=function(t,a,n,r){var i=Object.keys(t),o=i.length,s=a,l,u,c;for(n===void 0?(l=1,c=t[i[0]]):(l=0,c=n);l<o;l++)u=i[l],c=s(c,t[u],u,t);return c};function ja(e){return _(e).length!==1?null:e.codePointAt(0).toString(16)}function Pt(e){return Object.keys(e).reduce(function(t,a){var n=e[a],r=!!n.icon;return r?t[n.iconName]=n.icon:t[a]=n,t},{})}function Re(e,t){var a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},n=a.skipHooks,r=n===void 0?!1:n,i=Pt(t);typeof C.hooks.addPack=="function"&&!r?C.hooks.addPack(e,Pt(t)):C.styles[e]=f(f({},C.styles[e]||{}),i),e==="fas"&&Re("fa",t)}var ae=C.styles,gi=C.shims,Na=Object.keys(et),pi=Na.reduce(function(e,t){return e[t]=Object.keys(et[t]),e},{}),nt=null,Ta={},$a={},Ma={},Da={},La={};function yi(e){return~ni.indexOf(e)}function bi(e,t){var a=t.split("-"),n=a[0],r=a.slice(1).join("-");return n===e&&r!==""&&!yi(r)?r:null}var za=function(){var t=function(i){return Ee(ae,function(o,s,l){return o[l]=Ee(s,i,{}),o},{})};Ta=t(function(r,i,o){if(i[3]&&(r[i[3]]=o),i[2]){var s=i[2].filter(function(l){return typeof l=="number"});s.forEach(function(l){r[l.toString(16)]=o})}return r}),$a=t(function(r,i,o){if(r[o]=o,i[2]){var s=i[2].filter(function(l){return typeof l=="string"});s.forEach(function(l){r[l]=o})}return r}),La=t(function(r,i,o){var s=i[2];return r[o]=o,s.forEach(function(l){r[l]=o}),r});var a="far"in ae||v.autoFetchSvg,n=Ee(gi,function(r,i){var o=i[0],s=i[1],l=i[2];return s==="far"&&!a&&(s="fas"),typeof o=="string"&&(r.names[o]={prefix:s,iconName:l}),typeof o=="number"&&(r.unicodes[o.toString(16)]={prefix:s,iconName:l}),r},{names:{},unicodes:{}});Ma=n.names,Da=n.unicodes,nt=ye(v.styleDefault,{family:v.familyDefault})};si(function(e){nt=ye(e.styleDefault,{family:v.familyDefault})});za();function rt(e,t){return(Ta[e]||{})[t]}function xi(e,t){return($a[e]||{})[t]}function W(e,t){return(La[e]||{})[t]}function Ra(e){return Ma[e]||{prefix:null,iconName:null}}function wi(e){var t=Da[e],a=rt("fas",e);return t||(a?{prefix:"fas",iconName:a}:null)||{prefix:null,iconName:null}}function z(){return nt}var Wa=function(){return{prefix:null,iconName:null,rest:[]}};function Si(e){var t=k,a=Na.reduce(function(n,r){return n[r]="".concat(v.cssPrefix,"-").concat(r),n},{});return pa.forEach(function(n){(e.includes(a[n])||e.some(function(r){return pi[n].includes(r)}))&&(t=n)}),t}function ye(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.family,n=a===void 0?k:a,r=Qr[n][e];if(n===ne&&!e)return"fad";var i=wt[n][e]||wt[n][r],o=e in C.styles?e:null,s=i||o||null;return s}function Ai(e){var t=[],a=null;return e.forEach(function(n){var r=bi(v.cssPrefix,n);r?a=r:n&&t.push(n)}),{iconName:a,rest:t}}function It(e){return e.sort().filter(function(t,a,n){return n.indexOf(t)===a})}var Ot=ba.concat(ya);function be(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.skipLookups,n=a===void 0?!1:a,r=null,i=It(e.filter(function(p){return Ot.includes(p)})),o=It(e.filter(function(p){return!Ot.includes(p)})),s=i.filter(function(p){return r=p,!Zt.includes(p)}),l=ge(s,1),u=l[0],c=u===void 0?null:u,d=Si(i),y=f(f({},Ai(o)),{},{prefix:ye(c,{family:d})});return f(f(f({},y),Oi({values:e,family:d,styles:ae,config:v,canonical:y,givenPrefix:r})),ki(n,r,y))}function ki(e,t,a){var n=a.prefix,r=a.iconName;if(e||!n||!r)return{prefix:n,iconName:r};var i=t==="fa"?Ra(r):{},o=W(n,r);return r=i.iconName||o||r,n=i.prefix||n,n==="far"&&!ae.far&&ae.fas&&!v.autoFetchSvg&&(n="fas"),{prefix:n,iconName:r}}var Pi=pa.filter(function(e){return e!==k||e!==ne}),Ii=Object.keys(Te).filter(function(e){return e!==k}).map(function(e){return Object.keys(Te[e])}).flat();function Oi(e){var t=e.values,a=e.family,n=e.canonical,r=e.givenPrefix,i=r===void 0?"":r,o=e.styles,s=o===void 0?{}:o,l=e.config,u=l===void 0?{}:l,c=a===ne,d=t.includes("fa-duotone")||t.includes("fad"),y=u.familyDefault==="duotone",p=n.prefix==="fad"||n.prefix==="fa-duotone";if(!c&&(d||y||p)&&(n.prefix="fad"),(t.includes("fa-brands")||t.includes("fab"))&&(n.prefix="fab"),!n.prefix&&Pi.includes(a)){var S=Object.keys(s).find(function(A){return Ii.includes(A)});if(S||u.autoFetchSvg){var b=Un.get(a).defaultShortPrefixId;n.prefix=b,n.iconName=W(n.prefix,n.iconName)||n.iconName}}return(n.prefix==="fa"||i==="fa")&&(n.prefix=z()||"fas"),n}var Ei=(function(){function e(){fn(this,e),this.definitions={}}return cn(e,[{key:"add",value:function(){for(var a=this,n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];var o=r.reduce(this._pullDefinitions,{});Object.keys(o).forEach(function(s){a.definitions[s]=f(f({},a.definitions[s]||{}),o[s]),Re(s,o[s]);var l=et[k][s];l&&Re(l,o[s]),za()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(a,n){var r=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(r).map(function(i){var o=r[i],s=o.prefix,l=o.iconName,u=o.icon,c=u[2];a[s]||(a[s]={}),c.length>0&&c.forEach(function(d){typeof d=="string"&&(a[s][d]=u)}),a[s][l]=u}),a}}])})(),Et=[],X={},V={},Fi=Object.keys(V);function Ci(e,t){var a=t.mixoutsTo;return Et=e,X={},Object.keys(V).forEach(function(n){Fi.indexOf(n)===-1&&delete V[n]}),Et.forEach(function(n){var r=n.mixout?n.mixout():{};if(Object.keys(r).forEach(function(o){typeof r[o]=="function"&&(a[o]=r[o]),de(r[o])==="object"&&Object.keys(r[o]).forEach(function(s){a[o]||(a[o]={}),a[o][s]=r[o][s]})}),n.hooks){var i=n.hooks();Object.keys(i).forEach(function(o){X[o]||(X[o]=[]),X[o].push(i[o])})}n.provides&&n.provides(V)}),a}function We(e,t){for(var a=arguments.length,n=new Array(a>2?a-2:0),r=2;r<a;r++)n[r-2]=arguments[r];var i=X[e]||[];return i.forEach(function(o){t=o.apply(null,[t].concat(n))}),t}function B(e){for(var t=arguments.length,a=new Array(t>1?t-1:0),n=1;n<t;n++)a[n-1]=arguments[n];var r=X[e]||[];r.forEach(function(i){i.apply(null,a)})}function R(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return V[e]?V[e].apply(null,t):void 0}function Ue(e){e.prefix==="fa"&&(e.prefix="fas");var t=e.iconName,a=e.prefix||z();if(t)return t=W(a,t)||t,kt(Ua.definitions,a,t)||kt(C.styles,a,t)}var Ua=new Ei,_i=function(){v.autoReplaceSvg=!1,v.observeMutations=!1,B("noAuto")},ji={i2svg:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return D?(B("beforeI2svg",t),R("pseudoElements2svg",t),R("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=t.autoReplaceSvgRoot;v.autoReplaceSvg===!1&&(v.autoReplaceSvg=!0),v.observeMutations=!0,hi(function(){Ti({autoReplaceSvgRoot:a}),B("watch",t)})}},Ni={icon:function(t){if(t===null)return null;if(de(t)==="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:W(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){var a=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=ye(t[0]);return{prefix:n,iconName:W(n,a)||a}}if(typeof t=="string"&&(t.indexOf("".concat(v.cssPrefix,"-"))>-1||t.match(Zr))){var r=be(t.split(" "),{skipLookups:!0});return{prefix:r.prefix||z(),iconName:W(r.prefix,r.iconName)||r.iconName}}if(typeof t=="string"){var i=z();return{prefix:i,iconName:W(i,t)||t}}}},E={noAuto:_i,config:v,dom:ji,parse:Ni,library:Ua,findIconDefinition:Ue,toHtml:ie},Ti=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=t.autoReplaceSvgRoot,n=a===void 0?x:a;(Object.keys(C.styles).length>0||v.autoFetchSvg)&&D&&v.autoReplaceSvg&&E.dom.i2svg({node:n})};function xe(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(function(n){return ie(n)})}}),Object.defineProperty(e,"node",{get:function(){if(D){var n=x.createElement("div");return n.innerHTML=e.html,n.children}}}),e}function $i(e){var t=e.children,a=e.main,n=e.mask,r=e.attributes,i=e.styles,o=e.transform;if(at(o)&&a.found&&!n.found){var s=a.width,l=a.height,u={x:s/l/2,y:.5};r.style=pe(f(f({},i),{},{"transform-origin":"".concat(u.x+o.x/16,"em ").concat(u.y+o.y/16,"em")}))}return[{tag:"svg",attributes:r,children:t}]}function Mi(e){var t=e.prefix,a=e.iconName,n=e.children,r=e.attributes,i=e.symbol,o=i===!0?"".concat(t,"-").concat(v.cssPrefix,"-").concat(a):i;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:f(f({},r),{},{id:o}),children:n}]}]}function Di(e){var t=["aria-label","aria-labelledby","title","role"];return t.some(function(a){return a in e})}function it(e){var t=e.icons,a=t.main,n=t.mask,r=e.prefix,i=e.iconName,o=e.transform,s=e.symbol,l=e.maskId,u=e.extra,c=e.watchable,d=c===void 0?!1:c,y=n.found?n:a,p=y.width,S=y.height,b=[v.replacementClass,i?"".concat(v.cssPrefix,"-").concat(i):""].filter(function(O){return u.classes.indexOf(O)===-1}).filter(function(O){return O!==""||!!O}).concat(u.classes).join(" "),A={children:[],attributes:f(f({},u.attributes),{},{"data-prefix":r,"data-icon":i,class:b,role:u.attributes.role||"img",viewBox:"0 0 ".concat(p," ").concat(S)})};!Di(u.attributes)&&!u.attributes["aria-hidden"]&&(A.attributes["aria-hidden"]="true"),d&&(A.attributes[U]="");var m=f(f({},A),{},{prefix:r,iconName:i,main:a,mask:n,maskId:l,transform:o,symbol:s,styles:f({},u.styles)}),h=n.found&&a.found?R("generateAbstractMask",m)||{children:[],attributes:{}}:R("generateAbstractIcon",m)||{children:[],attributes:{}},w=h.children,P=h.attributes;return m.children=w,m.attributes=P,s?Mi(m):$i(m)}function Ft(e){var t=e.content,a=e.width,n=e.height,r=e.transform,i=e.extra,o=e.watchable,s=o===void 0?!1:o,l=f(f({},i.attributes),{},{class:i.classes.join(" ")});s&&(l[U]="");var u=f({},i.styles);at(r)&&(u.transform=di({transform:r,width:a,height:n}),u["-webkit-transform"]=u.transform);var c=pe(u);c.length>0&&(l.style=c);var d=[];return d.push({tag:"span",attributes:l,children:[t]}),d}function Li(e){var t=e.content,a=e.extra,n=f(f({},a.attributes),{},{class:a.classes.join(" ")}),r=pe(a.styles);r.length>0&&(n.style=r);var i=[];return i.push({tag:"span",attributes:n,children:[t]}),i}var Fe=C.styles;function Be(e){var t=e[0],a=e[1],n=e.slice(4),r=ge(n,1),i=r[0],o=null;return Array.isArray(i)?o={tag:"g",attributes:{class:"".concat(v.cssPrefix,"-").concat(Ie.GROUP)},children:[{tag:"path",attributes:{class:"".concat(v.cssPrefix,"-").concat(Ie.SECONDARY),fill:"currentColor",d:i[0]}},{tag:"path",attributes:{class:"".concat(v.cssPrefix,"-").concat(Ie.PRIMARY),fill:"currentColor",d:i[1]}}]}:o={tag:"path",attributes:{fill:"currentColor",d:i}},{found:!0,width:t,height:a,icon:o}}var zi={found:!1,width:512,height:512};function Ri(e,t){!ka&&!v.showMissingIcons&&e&&console.error('Icon with name "'.concat(e,'" and prefix "').concat(t,'" is missing.'))}function Ye(e,t){var a=t;return t==="fa"&&v.styleDefault!==null&&(t=z()),new Promise(function(n,r){if(a==="fa"){var i=Ra(e)||{};e=i.iconName||e,t=i.prefix||t}if(e&&t&&Fe[t]&&Fe[t][e]){var o=Fe[t][e];return n(Be(o))}Ri(e,t),n(f(f({},zi),{},{icon:v.showMissingIcons&&e?R("missingIconAbstract")||{}:{}}))})}var Ct=function(){},He=v.measurePerformance&&oe&&oe.mark&&oe.measure?oe:{mark:Ct,measure:Ct},Q='FA "7.2.0"',Wi=function(t){return He.mark("".concat(Q," ").concat(t," begins")),function(){return Ba(t)}},Ba=function(t){He.mark("".concat(Q," ").concat(t," ends")),He.measure("".concat(Q," ").concat(t),"".concat(Q," ").concat(t," begins"),"".concat(Q," ").concat(t," ends"))},ot={begin:Wi,end:Ba},ue=function(){};function _t(e){var t=e.getAttribute?e.getAttribute(U):null;return typeof t=="string"}function Ui(e){var t=e.getAttribute?e.getAttribute(Qe):null,a=e.getAttribute?e.getAttribute(Ze):null;return t&&a}function Bi(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(v.replacementClass)}function Yi(){if(v.autoReplaceSvg===!0)return ce.replace;var e=ce[v.autoReplaceSvg];return e||ce.replace}function Hi(e){return x.createElementNS("http://www.w3.org/2000/svg",e)}function Gi(e){return x.createElement(e)}function Ya(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.ceFn,n=a===void 0?e.tag==="svg"?Hi:Gi:a;if(typeof e=="string")return x.createTextNode(e);var r=n(e.tag);Object.keys(e.attributes||[]).forEach(function(o){r.setAttribute(o,e.attributes[o])});var i=e.children||[];return i.forEach(function(o){r.appendChild(Ya(o,{ceFn:n}))}),r}function Xi(e){var t=" ".concat(e.outerHTML," ");return t="".concat(t,"Font Awesome fontawesome.com "),t}var ce={replace:function(t){var a=t[0];if(a.parentNode)if(t[1].forEach(function(r){a.parentNode.insertBefore(Ya(r),a)}),a.getAttribute(U)===null&&v.keepOriginalSource){var n=x.createComment(Xi(a));a.parentNode.replaceChild(n,a)}else a.remove()},nest:function(t){var a=t[0],n=t[1];if(~tt(a).indexOf(v.replacementClass))return ce.replace(t);var r=new RegExp("".concat(v.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){var i=n[0].attributes.class.split(" ").reduce(function(s,l){return l===v.replacementClass||l.match(r)?s.toSvg.push(l):s.toNode.push(l),s},{toNode:[],toSvg:[]});n[0].attributes.class=i.toSvg.join(" "),i.toNode.length===0?a.removeAttribute("class"):a.setAttribute("class",i.toNode.join(" "))}var o=n.map(function(s){return ie(s)}).join(`
`);a.setAttribute(U,""),a.innerHTML=o}};function jt(e){e()}function Ha(e,t){var a=typeof t=="function"?t:ue;if(e.length===0)a();else{var n=jt;v.mutateApproach===qr&&(n=L.requestAnimationFrame||jt),n(function(){var r=Yi(),i=ot.begin("mutate");e.map(r),i(),a()})}}var st=!1;function Ga(){st=!0}function Ge(){st=!1}var ve=null;function Nt(e){if(pt&&v.observeMutations){var t=e.treeCallback,a=t===void 0?ue:t,n=e.nodeCallback,r=n===void 0?ue:n,i=e.pseudoElementsCallback,o=i===void 0?ue:i,s=e.observeMutationsRoot,l=s===void 0?x:s;ve=new pt(function(u){if(!st){var c=z();q(u).forEach(function(d){if(d.type==="childList"&&d.addedNodes.length>0&&!_t(d.addedNodes[0])&&(v.searchPseudoElements&&o(d.target),a(d.target)),d.type==="attributes"&&d.target.parentNode&&v.searchPseudoElements&&o([d.target],!0),d.type==="attributes"&&_t(d.target)&&~ai.indexOf(d.attributeName))if(d.attributeName==="class"&&Ui(d.target)){var y=be(tt(d.target)),p=y.prefix,S=y.iconName;d.target.setAttribute(Qe,p||c),S&&d.target.setAttribute(Ze,S)}else Bi(d.target)&&r(d.target)})}}),D&&ve.observe(l,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function Vi(){ve&&ve.disconnect()}function Ki(e){var t=e.getAttribute("style"),a=[];return t&&(a=t.split(";").reduce(function(n,r){var i=r.split(":"),o=i[0],s=i.slice(1);return o&&s.length>0&&(n[o]=s.join(":").trim()),n},{})),a}function qi(e){var t=e.getAttribute("data-prefix"),a=e.getAttribute("data-icon"),n=e.innerText!==void 0?e.innerText.trim():"",r=be(tt(e));return r.prefix||(r.prefix=z()),t&&a&&(r.prefix=t,r.iconName=a),r.iconName&&r.prefix||(r.prefix&&n.length>0&&(r.iconName=xi(r.prefix,e.innerText)||rt(r.prefix,ja(e.innerText))),!r.iconName&&v.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=e.firstChild.data)),r}function Ji(e){var t=q(e.attributes).reduce(function(a,n){return a.name!=="class"&&a.name!=="style"&&(a[n.name]=n.value),a},{});return t}function Qi(){return{iconName:null,prefix:null,transform:N,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Tt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},a=qi(e),n=a.iconName,r=a.prefix,i=a.rest,o=Ji(e),s=We("parseNodeAttributes",{},e),l=t.styleParser?Ki(e):[];return f({iconName:n,prefix:r,transform:N,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:i,styles:l,attributes:o}},s)}var Zi=C.styles;function Xa(e){var t=v.autoReplaceSvg==="nest"?Tt(e,{styleParser:!1}):Tt(e);return~t.extra.classes.indexOf(Ia)?R("generateLayersText",e,t):R("generateSvgReplacementMutation",e,t)}function eo(){return[].concat(_(ya),_(ba))}function $t(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!D)return Promise.resolve();var a=x.documentElement.classList,n=function(d){return a.add("".concat(xt,"-").concat(d))},r=function(d){return a.remove("".concat(xt,"-").concat(d))},i=v.autoFetchSvg?eo():Zt.concat(Object.keys(Zi));i.includes("fa")||i.push("fa");var o=[".".concat(Ia,":not([").concat(U,"])")].concat(i.map(function(c){return".".concat(c,":not([").concat(U,"])")})).join(", ");if(o.length===0)return Promise.resolve();var s=[];try{s=q(e.querySelectorAll(o))}catch{}if(s.length>0)n("pending"),r("complete");else return Promise.resolve();var l=ot.begin("onTree"),u=s.reduce(function(c,d){try{var y=Xa(d);y&&c.push(y)}catch(p){ka||p.name==="MissingIcon"&&console.error(p)}return c},[]);return new Promise(function(c,d){Promise.all(u).then(function(y){Ha(y,function(){n("active"),n("complete"),r("pending"),typeof t=="function"&&t(),l(),c()})}).catch(function(y){l(),d(y)})})}function to(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Xa(e).then(function(a){a&&Ha([a],t)})}function ao(e){return function(t){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=(t||{}).icon?t:Ue(t||{}),r=a.mask;return r&&(r=(r||{}).icon?r:Ue(r||{})),e(n,f(f({},a),{},{mask:r}))}}var no=function(t){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=a.transform,r=n===void 0?N:n,i=a.symbol,o=i===void 0?!1:i,s=a.mask,l=s===void 0?null:s,u=a.maskId,c=u===void 0?null:u,d=a.classes,y=d===void 0?[]:d,p=a.attributes,S=p===void 0?{}:p,b=a.styles,A=b===void 0?{}:b;if(t){var m=t.prefix,h=t.iconName,w=t.icon;return xe(f({type:"icon"},t),function(){return B("beforeDOMElementCreation",{iconDefinition:t,params:a}),it({icons:{main:Be(w),mask:l?Be(l.icon):{found:!1,width:null,height:null,icon:{}}},prefix:m,iconName:h,transform:f(f({},N),r),symbol:o,maskId:c,extra:{attributes:S,styles:A,classes:y}})})}},ro={mixout:function(){return{icon:ao(no)}},hooks:function(){return{mutationObserverCallbacks:function(a){return a.treeCallback=$t,a.nodeCallback=to,a}}},provides:function(t){t.i2svg=function(a){var n=a.node,r=n===void 0?x:n,i=a.callback,o=i===void 0?function(){}:i;return $t(r,o)},t.generateSvgReplacementMutation=function(a,n){var r=n.iconName,i=n.prefix,o=n.transform,s=n.symbol,l=n.mask,u=n.maskId,c=n.extra;return new Promise(function(d,y){Promise.all([Ye(r,i),l.iconName?Ye(l.iconName,l.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(p){var S=ge(p,2),b=S[0],A=S[1];d([a,it({icons:{main:b,mask:A},prefix:i,iconName:r,transform:o,symbol:s,maskId:u,extra:c,watchable:!0})])}).catch(y)})},t.generateAbstractIcon=function(a){var n=a.children,r=a.attributes,i=a.main,o=a.transform,s=a.styles,l=pe(s);l.length>0&&(r.style=l);var u;return at(o)&&(u=R("generateAbstractTransformGrouping",{main:i,transform:o,containerWidth:i.width,iconWidth:i.width})),n.push(u||i.icon),{children:n,attributes:r}}}},io={mixout:function(){return{layer:function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=n.classes,i=r===void 0?[]:r;return xe({type:"layer"},function(){B("beforeDOMElementCreation",{assembler:a,params:n});var o=[];return a(function(s){Array.isArray(s)?s.map(function(l){o=o.concat(l.abstract)}):o=o.concat(s.abstract)}),[{tag:"span",attributes:{class:["".concat(v.cssPrefix,"-layers")].concat(_(i)).join(" ")},children:o}]})}}}},oo={mixout:function(){return{counter:function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};n.title;var r=n.classes,i=r===void 0?[]:r,o=n.attributes,s=o===void 0?{}:o,l=n.styles,u=l===void 0?{}:l;return xe({type:"counter",content:a},function(){return B("beforeDOMElementCreation",{content:a,params:n}),Li({content:a.toString(),extra:{attributes:s,styles:u,classes:["".concat(v.cssPrefix,"-layers-counter")].concat(_(i))}})})}}}},so={mixout:function(){return{text:function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=n.transform,i=r===void 0?N:r,o=n.classes,s=o===void 0?[]:o,l=n.attributes,u=l===void 0?{}:l,c=n.styles,d=c===void 0?{}:c;return xe({type:"text",content:a},function(){return B("beforeDOMElementCreation",{content:a,params:n}),Ft({content:a,transform:f(f({},N),i),extra:{attributes:u,styles:d,classes:["".concat(v.cssPrefix,"-layers-text")].concat(_(s))}})})}}},provides:function(t){t.generateLayersText=function(a,n){var r=n.transform,i=n.extra,o=null,s=null;if(Jt){var l=parseInt(getComputedStyle(a).fontSize,10),u=a.getBoundingClientRect();o=u.width/l,s=u.height/l}return Promise.resolve([a,Ft({content:a.innerHTML,width:o,height:s,transform:r,extra:i,watchable:!0})])}}},Va=new RegExp('"',"ug"),Mt=[1105920,1112319],Dt=f(f(f(f({},{FontAwesome:{normal:"fas",400:"fas"}}),Wn),Vr),qn),Xe=Object.keys(Dt).reduce(function(e,t){return e[t.toLowerCase()]=Dt[t],e},{}),lo=Object.keys(Xe).reduce(function(e,t){var a=Xe[t];return e[t]=a[900]||_(Object.entries(a))[0][1],e},{});function fo(e){var t=e.replace(Va,"");return ja(_(t)[0]||"")}function uo(e){var t=e.getPropertyValue("font-feature-settings").includes("ss01"),a=e.getPropertyValue("content"),n=a.replace(Va,""),r=n.codePointAt(0),i=r>=Mt[0]&&r<=Mt[1],o=n.length===2?n[0]===n[1]:!1;return i||o||t}function co(e,t){var a=e.replace(/^['"]|['"]$/g,"").toLowerCase(),n=parseInt(t),r=isNaN(n)?"normal":n;return(Xe[a]||{})[r]||lo[a]}function Lt(e,t){var a="".concat(Kr).concat(t.replace(":","-"));return new Promise(function(n,r){if(e.getAttribute(a)!==null)return n();var i=q(e.children),o=i.filter(function(Y){return Y.getAttribute(Me)===t})[0],s=L.getComputedStyle(e,t),l=s.getPropertyValue("font-family"),u=l.match(ei),c=s.getPropertyValue("font-weight"),d=s.getPropertyValue("content");if(o&&!u)return e.removeChild(o),n();if(u&&d!=="none"&&d!==""){var y=s.getPropertyValue("content"),p=co(l,c),S=fo(y),b=u[0].startsWith("FontAwesome"),A=uo(s),m=rt(p,S),h=m;if(b){var w=wi(S);w.iconName&&w.prefix&&(m=w.iconName,p=w.prefix)}if(m&&!A&&(!o||o.getAttribute(Qe)!==p||o.getAttribute(Ze)!==h)){e.setAttribute(a,h),o&&e.removeChild(o);var P=Qi(),O=P.extra;O.attributes[Me]=t,Ye(m,p).then(function(Y){var J=it(f(f({},P),{},{icons:{main:Y,mask:Wa()},prefix:p,iconName:h,extra:O,watchable:!0})),we=x.createElementNS("http://www.w3.org/2000/svg","svg");t==="::before"?e.insertBefore(we,e.firstChild):e.appendChild(we),we.outerHTML=J.map(function(Za){return ie(Za)}).join(`
`),e.removeAttribute(a),n()}).catch(r)}else n()}else n()})}function mo(e){return Promise.all([Lt(e,"::before"),Lt(e,"::after")])}function vo(e){return e.parentNode!==document.head&&!~Jr.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(Me)&&(!e.parentNode||e.parentNode.tagName!=="svg")}var ho=function(t){return!!t&&Aa.some(function(a){return t.includes(a)})},go=function(t){if(!t)return[];var a=new Set,n=t.split(/,(?![^()]*\))/).map(function(l){return l.trim()});n=n.flatMap(function(l){return l.includes("(")?l:l.split(",").map(function(u){return u.trim()})});var r=fe(n),i;try{for(r.s();!(i=r.n()).done;){var o=i.value;if(ho(o)){var s=Aa.reduce(function(l,u){return l.replace(u,"")},o);s!==""&&s!=="*"&&a.add(s)}}}catch(l){r.e(l)}finally{r.f()}return a};function zt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(D){var a;if(t)a=e;else if(v.searchPseudoElementsFullScan)a=e.querySelectorAll("*");else{var n=new Set,r=fe(document.styleSheets),i;try{for(r.s();!(i=r.n()).done;){var o=i.value;try{var s=fe(o.cssRules),l;try{for(s.s();!(l=s.n()).done;){var u=l.value,c=go(u.selectorText),d=fe(c),y;try{for(d.s();!(y=d.n()).done;){var p=y.value;n.add(p)}}catch(b){d.e(b)}finally{d.f()}}}catch(b){s.e(b)}finally{s.f()}}catch(b){v.searchPseudoElementsWarnings&&console.warn("Font Awesome: cannot parse stylesheet: ".concat(o.href," (").concat(b.message,`)
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`))}}}catch(b){r.e(b)}finally{r.f()}if(!n.size)return;var S=Array.from(n).join(", ");try{a=e.querySelectorAll(S)}catch{}}return new Promise(function(b,A){var m=q(a).filter(vo).map(mo),h=ot.begin("searchPseudoElements");Ga(),Promise.all(m).then(function(){h(),Ge(),b()}).catch(function(){h(),Ge(),A()})})}}var po={hooks:function(){return{mutationObserverCallbacks:function(a){return a.pseudoElementsCallback=zt,a}}},provides:function(t){t.pseudoElements2svg=function(a){var n=a.node,r=n===void 0?x:n;v.searchPseudoElements&&zt(r)}}},Rt=!1,yo={mixout:function(){return{dom:{unwatch:function(){Ga(),Rt=!0}}}},hooks:function(){return{bootstrap:function(){Nt(We("mutationObserverCallbacks",{}))},noAuto:function(){Vi()},watch:function(a){var n=a.observeMutationsRoot;Rt?Ge():Nt(We("mutationObserverCallbacks",{observeMutationsRoot:n}))}}}},Wt=function(t){var a={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce(function(n,r){var i=r.toLowerCase().split("-"),o=i[0],s=i.slice(1).join("-");if(o&&s==="h")return n.flipX=!0,n;if(o&&s==="v")return n.flipY=!0,n;if(s=parseFloat(s),isNaN(s))return n;switch(o){case"grow":n.size=n.size+s;break;case"shrink":n.size=n.size-s;break;case"left":n.x=n.x-s;break;case"right":n.x=n.x+s;break;case"up":n.y=n.y-s;break;case"down":n.y=n.y+s;break;case"rotate":n.rotate=n.rotate+s;break}return n},a)},bo={mixout:function(){return{parse:{transform:function(a){return Wt(a)}}}},hooks:function(){return{parseNodeAttributes:function(a,n){var r=n.getAttribute("data-fa-transform");return r&&(a.transform=Wt(r)),a}}},provides:function(t){t.generateAbstractTransformGrouping=function(a){var n=a.main,r=a.transform,i=a.containerWidth,o=a.iconWidth,s={transform:"translate(".concat(i/2," 256)")},l="translate(".concat(r.x*32,", ").concat(r.y*32,") "),u="scale(".concat(r.size/16*(r.flipX?-1:1),", ").concat(r.size/16*(r.flipY?-1:1),") "),c="rotate(".concat(r.rotate," 0 0)"),d={transform:"".concat(l," ").concat(u," ").concat(c)},y={transform:"translate(".concat(o/2*-1," -256)")},p={outer:s,inner:d,path:y};return{tag:"g",attributes:f({},p.outer),children:[{tag:"g",attributes:f({},p.inner),children:[{tag:n.icon.tag,children:n.icon.children,attributes:f(f({},n.icon.attributes),p.path)}]}]}}}},Ce={x:0,y:0,width:"100%",height:"100%"};function Ut(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill="black"),e}function xo(e){return e.tag==="g"?e.children:[e]}var wo={hooks:function(){return{parseNodeAttributes:function(a,n){var r=n.getAttribute("data-fa-mask"),i=r?be(r.split(" ").map(function(o){return o.trim()})):Wa();return i.prefix||(i.prefix=z()),a.mask=i,a.maskId=n.getAttribute("data-fa-mask-id"),a}}},provides:function(t){t.generateAbstractMask=function(a){var n=a.children,r=a.attributes,i=a.main,o=a.mask,s=a.maskId,l=a.transform,u=i.width,c=i.icon,d=o.width,y=o.icon,p=ci({transform:l,containerWidth:d,iconWidth:u}),S={tag:"rect",attributes:f(f({},Ce),{},{fill:"white"})},b=c.children?{children:c.children.map(Ut)}:{},A={tag:"g",attributes:f({},p.inner),children:[Ut(f({tag:c.tag,attributes:f(f({},c.attributes),p.path)},b))]},m={tag:"g",attributes:f({},p.outer),children:[A]},h="mask-".concat(s||St()),w="clip-".concat(s||St()),P={tag:"mask",attributes:f(f({},Ce),{},{id:h,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[S,m]},O={tag:"defs",children:[{tag:"clipPath",attributes:{id:w},children:xo(y)},P]};return n.push(O,{tag:"rect",attributes:f({fill:"currentColor","clip-path":"url(#".concat(w,")"),mask:"url(#".concat(h,")")},Ce)}),{children:n,attributes:r}}}},So={provides:function(t){var a=!1;L.matchMedia&&(a=L.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){var n=[],r={fill:"currentColor"},i={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:f(f({},r),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});var o=f(f({},i),{},{attributeName:"opacity"}),s={tag:"circle",attributes:f(f({},r),{},{cx:"256",cy:"364",r:"28"}),children:[]};return a||s.children.push({tag:"animate",attributes:f(f({},i),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:f(f({},o),{},{values:"1;0;1;1;0;1;"})}),n.push(s),n.push({tag:"path",attributes:f(f({},r),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:a?[]:[{tag:"animate",attributes:f(f({},o),{},{values:"1;0;0;0;0;1;"})}]}),a||n.push({tag:"path",attributes:f(f({},r),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:f(f({},o),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},Ao={hooks:function(){return{parseNodeAttributes:function(a,n){var r=n.getAttribute("data-fa-symbol"),i=r===null?!1:r===""?!0:r;return a.symbol=i,a}}}},ko=[vi,ro,io,oo,so,po,yo,bo,wo,So,Ao];Ci(ko,{mixoutsTo:E});E.noAuto;E.config;E.library;E.dom;var Ve=E.parse;E.findIconDefinition;E.toHtml;var Po=E.icon;E.layer;E.text;E.counter;function I(e,t,a){return(t=Fo(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function Bt(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),a.push.apply(a,n)}return a}function T(e){for(var t=1;t<arguments.length;t++){var a=arguments[t]!=null?arguments[t]:{};t%2?Bt(Object(a),!0).forEach(function(n){I(e,n,a[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):Bt(Object(a)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))})}return e}function Io(e,t){if(e==null)return{};var a,n,r=Oo(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)===-1&&{}.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}function Oo(e,t){if(e==null)return{};var a={};for(var n in e)if({}.hasOwnProperty.call(e,n)){if(t.indexOf(n)!==-1)continue;a[n]=e[n]}return a}function Eo(e,t){if(typeof e!="object"||!e)return e;var a=e[Symbol.toPrimitive];if(a!==void 0){var n=a.call(e,t);if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function Fo(e){var t=Eo(e,"string");return typeof t=="symbol"?t:t+""}function he(e){"@babel/helpers - typeof";return he=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},he(e)}function _e(e,t){return Array.isArray(t)&&t.length>0||!Array.isArray(t)&&t?I({},e,t):{}}function Co(e){var t,a=(t={"fa-spin":e.spin,"fa-pulse":e.pulse,"fa-fw":e.fixedWidth,"fa-border":e.border,"fa-li":e.listItem,"fa-inverse":e.inverse,"fa-flip":e.flip===!0,"fa-flip-horizontal":e.flip==="horizontal"||e.flip==="both","fa-flip-vertical":e.flip==="vertical"||e.flip==="both"},I(I(I(I(I(I(I(I(I(I(t,"fa-".concat(e.size),e.size!==null),"fa-rotate-".concat(e.rotation),e.rotation!==null),"fa-rotate-by",e.rotateBy),"fa-pull-".concat(e.pull),e.pull!==null),"fa-swap-opacity",e.swapOpacity),"fa-bounce",e.bounce),"fa-shake",e.shake),"fa-beat",e.beat),"fa-fade",e.fade),"fa-beat-fade",e.beatFade),I(I(I(I(t,"fa-flash",e.flash),"fa-spin-pulse",e.spinPulse),"fa-spin-reverse",e.spinReverse),"fa-width-auto",e.widthAuto));return Object.keys(a).map(function(n){return a[n]?n:null}).filter(function(n){return n})}var _o=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Ka={exports:{}};(function(e){(function(t){var a=function(m,h,w){if(!u(h)||d(h)||y(h)||p(h)||l(h))return h;var P,O=0,Y=0;if(c(h))for(P=[],Y=h.length;O<Y;O++)P.push(a(m,h[O],w));else{P={};for(var J in h)Object.prototype.hasOwnProperty.call(h,J)&&(P[m(J,w)]=a(m,h[J],w))}return P},n=function(m,h){h=h||{};var w=h.separator||"_",P=h.split||/(?=[A-Z])/;return m.split(P).join(w)},r=function(m){return S(m)?m:(m=m.replace(/[\-_\s]+(.)?/g,function(h,w){return w?w.toUpperCase():""}),m.substr(0,1).toLowerCase()+m.substr(1))},i=function(m){var h=r(m);return h.substr(0,1).toUpperCase()+h.substr(1)},o=function(m,h){return n(m,h).toLowerCase()},s=Object.prototype.toString,l=function(m){return typeof m=="function"},u=function(m){return m===Object(m)},c=function(m){return s.call(m)=="[object Array]"},d=function(m){return s.call(m)=="[object Date]"},y=function(m){return s.call(m)=="[object RegExp]"},p=function(m){return s.call(m)=="[object Boolean]"},S=function(m){return m=m-0,m===m},b=function(m,h){var w=h&&"process"in h?h.process:h;return typeof w!="function"?m:function(P,O){return w(P,m,O)}},A={camelize:r,decamelize:o,pascalize:i,depascalize:o,camelizeKeys:function(m,h){return a(b(r,h),m)},decamelizeKeys:function(m,h){return a(b(o,h),m,h)},pascalizeKeys:function(m,h){return a(b(i,h),m)},depascalizeKeys:function(){return this.decamelizeKeys.apply(this,arguments)}};e.exports?e.exports=A:t.humps=A})(_o)})(Ka);var jo=Ka.exports,No=["class","style"];function To(e){return e.split(";").map(function(t){return t.trim()}).filter(function(t){return t}).reduce(function(t,a){var n=a.indexOf(":"),r=jo.camelize(a.slice(0,n)),i=a.slice(n+1).trim();return t[r]=i,t},{})}function $o(e){return e.split(/\s+/).reduce(function(t,a){return t[a]=!0,t},{})}function qa(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(typeof e=="string")return e;var n=(e.children||[]).map(function(l){return qa(l)}),r=Object.keys(e.attributes||{}).reduce(function(l,u){var c=e.attributes[u];switch(u){case"class":l.class=$o(c);break;case"style":l.style=To(c);break;default:l.attrs[u]=c}return l},{attrs:{},class:{},style:{}});a.class;var i=a.style,o=i===void 0?{}:i,s=Io(a,No);return en(e.tag,T(T(T({},t),{},{class:r.class,style:T(T({},r.style),o)},r.attrs),s),n)}var Ja=!1;try{Ja=!0}catch{}function Mo(){if(!Ja&&console&&typeof console.error=="function"){var e;(e=console).error.apply(e,arguments)}}function Yt(e){if(e&&he(e)==="object"&&e.prefix&&e.iconName&&e.icon)return e;if(Ve.icon)return Ve.icon(e);if(e===null)return null;if(he(e)==="object"&&e.prefix&&e.iconName)return e;if(Array.isArray(e)&&e.length===2)return{prefix:e[0],iconName:e[1]};if(typeof e=="string")return{prefix:"fas",iconName:e}}var Do=Ke({name:"FontAwesomeIcon",props:{border:{type:Boolean,default:!1},fixedWidth:{type:Boolean,default:!1},flip:{type:[Boolean,String],default:!1,validator:function(t){return[!0,!1,"horizontal","vertical","both"].indexOf(t)>-1}},icon:{type:[Object,Array,String],required:!0},mask:{type:[Object,Array,String],default:null},maskId:{type:String,default:null},listItem:{type:Boolean,default:!1},pull:{type:String,default:null,validator:function(t){return["right","left"].indexOf(t)>-1}},pulse:{type:Boolean,default:!1},rotation:{type:[String,Number],default:null,validator:function(t){return[90,180,270].indexOf(Number.parseInt(t,10))>-1}},rotateBy:{type:Boolean,default:!1},swapOpacity:{type:Boolean,default:!1},size:{type:String,default:null,validator:function(t){return["2xs","xs","sm","lg","xl","2xl","1x","2x","3x","4x","5x","6x","7x","8x","9x","10x"].indexOf(t)>-1}},spin:{type:Boolean,default:!1},transform:{type:[String,Object],default:null},symbol:{type:[Boolean,String],default:!1},title:{type:String,default:null},titleId:{type:String,default:null},inverse:{type:Boolean,default:!1},bounce:{type:Boolean,default:!1},shake:{type:Boolean,default:!1},beat:{type:Boolean,default:!1},fade:{type:Boolean,default:!1},beatFade:{type:Boolean,default:!1},flash:{type:Boolean,default:!1},spinPulse:{type:Boolean,default:!1},spinReverse:{type:Boolean,default:!1},widthAuto:{type:Boolean,default:!1}},setup:function(t,a){var n=a.attrs,r=j(function(){return Yt(t.icon)}),i=j(function(){return _e("classes",Co(t))}),o=j(function(){return _e("transform",typeof t.transform=="string"?Ve.transform(t.transform):t.transform)}),s=j(function(){return _e("mask",Yt(t.mask))}),l=j(function(){var c=T(T(T(T({},i.value),o.value),s.value),{},{symbol:t.symbol,maskId:t.maskId});return c.title=t.title,c.titleId=t.titleId,Po(r.value,c)});Gt(l,function(c){if(!c)return Mo("Could not find one or more icon(s)",r.value,s.value)},{immediate:!0});var u=j(function(){return l.value?qa(l.value.abstract[0],{},n):null});return function(){return u.value}}});var Lo={prefix:"fas",iconName:"xmark",icon:[384,512,[128473,10005,10006,10060,215,"close","multiply","remove","times"],"f00d","M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"]};let te=0,Qa="";function zo(){typeof document>"u"||(te===0&&(Qa=document.body.style.overflow,document.body.style.overflow="hidden"),te+=1)}function Ht(){typeof document>"u"||te===0||(te-=1,te===0&&(document.body.style.overflow=Qa))}const Ro={key:0,class:"fixed inset-0 z-[100] flex h-dvh w-screen items-center justify-center bg-ink/45 px-3 py-4"},Wo={"data-testid":"exam-modal",class:"exam-modal-card surface-card","aria-modal":"true",role:"dialog"},Uo={class:"flex h-[48px] items-center justify-between border-b border-clay/10 px-4"},Bo={class:"text-sm font-semibold text-ink"},Yo={class:"flex-1 border-b border-clay/10 px-4 py-3 sm:px-5 sm:py-4"},Ho={key:0,"data-testid":"exam-hint",class:"text-sm text-ink/65"},Go={"data-testid":"exam-actions",class:"flex h-[56px] items-center justify-between px-4"},qo=Ke({__name:"ExamModal",props:{open:{type:Boolean},question:{},currentIndex:{},totalQuestions:{},promptSize:{default:"lg"},showHint:{type:Boolean,default:!0},answerMultiline:{type:Boolean,default:!1},manageBodyScroll:{type:Boolean,default:!0}},emits:["next","unknown","confirmClose"],setup(e,{emit:t}){const a=e,n=t,r=j(()=>["exam-modal-prompt",`exam-modal-prompt-${a.promptSize}`]),i=j(()=>["exam-modal-answer",{"exam-modal-answer-multiline":a.answerMultiline}]),o=j(()=>["exam-modal-body",{"exam-modal-body-compact":a.answerMultiline}]),s=j(()=>a.question?.answerRevealed?"已顯示答案，請決定是否標記為我不清楚":"請先自行作答，再決定是否按下我不清楚");function l(){window.confirm("確定要結束練習嗎？")&&n("confirmClose")}return Gt(()=>a.open,u=>{if(a.manageBodyScroll){if(u){zo();return}Ht()}},{immediate:!0}),tn(()=>{a.open&&a.manageBodyScroll&&Ht()}),(u,c)=>(le(),an(nn,{to:"body"},[a.open?(le(),je("div",Ro,[F("section",Wo,[F("div",Uo,[F("p",Bo,G(a.totalQuestions===0?0:a.currentIndex+1)+" / "+G(a.totalQuestions),1),F("button",{type:"button",class:"text-lg text-ink/70 hover:text-ink","aria-label":"關閉練習",onClick:l},[Se(lt(Do),{icon:lt(Lo)},null,8,["icon"])])]),F("div",Yo,[F("div",{"data-testid":"exam-modal-body",class:Ae(o.value)},[F("p",{"data-testid":"exam-prompt",class:Ae(r.value)},G(a.question?.promptText??"-"),3),F("p",{"data-testid":"exam-answer",class:Ae(i.value)},G(a.question?.answerRevealed?a.question.answerText:""),3),a.showHint?(le(),je("p",Ho,G(s.value),1)):ft("",!0)],2)]),F("div",Go,[Se(ut,{"data-testid":"exam-unknown-button",variant:"danger",onClick:c[0]||(c[0]=d=>n("unknown"))},{default:ct(()=>[...c[2]||(c[2]=[dt(" 我不清楚 ",-1)])]),_:1}),Se(ut,{"data-testid":"exam-next-button",variant:"ghost",onClick:c[1]||(c[1]=d=>n("next"))},{default:ct(()=>[...c[3]||(c[3]=[dt(" 下一步 ",-1)])]),_:1})])])])):ft("",!0)]))}});function Xo(e){const t=[...e];for(let a=t.length-1;a>0;a-=1){const n=Math.floor(Math.random()*(a+1)),r=t[a],i=t[n];t[a]=i,t[n]=r}return t}function Jo(e,t){if(e.length===0||t<=0)return[];const a=[];for(;a.length<t;)a.push(...Xo(e));return a.slice(0,t)}export{Ko as _,qo as a,Jo as b,zo as l,Xo as s,Ht as u};
