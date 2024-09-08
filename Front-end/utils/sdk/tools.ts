import dayjs from "dayjs";
import { BigNumber } from "bignumber.js";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);
BigNumber.config({ ROUNDING_MODE: 1 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

export function convertBigNumberToNormal(_number: string | BigNumber | number, decimals = 18, fix = 10) {
    let number = _number;
    if (typeof _number !== "string")
        number = _number.toString();
    let result = new BigNumber(number).dividedBy(new BigNumber(Math.pow(10, decimals)));
    return result.toFixed(fix);
}

export function convertNormalToBigNumber(number: string | number, decimals = 18, fix = 0) {
    return new BigNumber(number).multipliedBy(new BigNumber(Math.pow(10, decimals))).minus(fix).toFixed(0);
}
//to percent
export function calculatePercentage(numerator: string, denominator: string) {
    return new BigNumber(numerator)
        .dividedBy(new BigNumber(denominator))
        .toFixed();
}
// x+y
export function add(number1: string, number2: string, fix = 10) {
    return new BigNumber(number1).plus(new BigNumber(number2)).toFixed(fix);
}
// x-y
export function sub(number1: string, number2: string, fix = 10) {
    return new BigNumber(number1).minus(new BigNumber(number2)).toFixed(fix);
}
// x*y
export function mul(number1: string, number2: string, fix = 10) {
    return new BigNumber(number1).times(new BigNumber(number2)).toFixed(fix);
}
//  x/y
export function div(number1: string, number2: string, fix = 10) {
    return new BigNumber(number1).div(new BigNumber(number2)).toFixed(fix);
}
export function convertToPaddedUint8Array(str: string, length: number) {
    const value = Uint8Array.from(Buffer.from(str.replace(/^0x/i, "").padStart(length, "0"), "hex"))
    return Uint8Array.from([...new Uint8Array(length - value.length), ...value])
}
// Keep N decimal places and cut endwith 0
export function toFixedCutZero(num: number | string, fix = 2, thousand = false) {
    return toFormatNumber(num, fix, thousand, true);
}
//Keep N decimal places and No rounding
export function toFixedNumber(num: number | string, fix = 2, thousand = false) {
    return toFormatNumber(num, fix, thousand, false);
}
var monthNames = new Array(12);
monthNames[0] = "January";
monthNames[1] = "February";
monthNames[2] = "March";
monthNames[3] = "April";
monthNames[4] = "May";
monthNames[5] = "June";
monthNames[6] = "July";
monthNames[7] = "August";
monthNames[8] = "September";
monthNames[9] = "October";
monthNames[10] = "November";
monthNames[11] = "December";
//to month
export function toMonthName(monthNumber: number, abbreviation = false) {
    if (monthNumber < 1) monthNumber = 1;
    let suffix = "";
    let month = monthNames[monthNumber - 1];
    if (month.length > 3) suffix = ".";
    if (abbreviation) month = month.slice(0, 3);
    return month + suffix;
}
function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}
//rgb to #
export function rgbToHex(r: number, g: number, b: number) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
//Find the value of this query parameter in the URL of the current page and return it.
//eg:***?id=123&name=hhh    gpu('id')=>123
// export function gup(name: string) {
//     name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
//     var regexS = "[\\?&]" + name + "=([^&#]*)";
//     var regex = new RegExp(regexS);
//     var results = regex.exec(window.location.href);
//     if (results == null)
//         return "";
//     else
//         return results[1];
// }
//Convert the value to the interval between min and rangeSize.
export function wrap(value: number, min: number, rangeSize: number) {
    rangeSize -= min;
    while (value < min) {
        value += rangeSize;
    }
    return value % rangeSize;
}
//Convert the value v from the interval [i1, i2] to the interval [o1, o2]
export function map(v: number, i1: number, i2: number, o1: number, o2: number) {
    return o1 + (o2 - o1) * (v - i1) / (i2 - i1);
}
//Scaling method with rounding
export function roundNumber(num: number, dec: number) {
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}
//value is a string, ia is the converted ASCII value, off is the starting offset, size is the number of bits to operate on, and the function returns the sum of ASCII values.
export function dumpString(value: string, ia: number[], off: number, size: number) {
    var i, x;
    var sum = 0;
    var len = Math.min(value.length, size);
    for (i = 0; i < len; i++) {
        x = value.charCodeAt(i);
        ia[off] = x;
        sum += x;
        off += 1;
    }
    return sum;
}
export const toHex = (num: Number | string) => {
    const val = Number(num);
    return "0x" + val.toString(16);
};
//Pad with zeros on the left
export function padLeft(value: string, size: number) {
    if (size < value.length) {
        printf("Incompatible size");
    }
    var l = size - value.length;
    for (var i = 0; i < l; i++) {
        value = "0" + value;
    }
    return value;
}
//Format as thousands separator
export function toThousands(num: number | string) {
    num = num + "";
    if (+num < 1000)
        return num;
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    if (num.includes('.')) {
        let [_integer, _decimal] = num.split('.');
        return _integer.replace(reg, '$&,') + '.' + _decimal;
    } else {
        return num.replace(reg, '$&,');
    }
}
//Format numerical values
export function toFormatNumber(num: number | string, fix = 2, thousand = false, cutZero = false) {
    let str = num + "";
    if (!(/^(-)?[0-9.]+$/g.test(str))) return '0';
    if (!str.includes('.')) {
        str = str + '.';
    }
    str = str + '00000000';
    let index = str.indexOf('.');
    str = str.slice(0, index + fix + 1);
    if (cutZero) {
        while (str.includes(".") && (str.endsWith('.') || str.endsWith('0'))) {
            str = str.slice(0, -1)
        }
    }
    if (thousand) {
        str = toThousands(str);
    }
    return str;
}
//Convert amount to M B unit display
export function formatAmount(str: number | string, fix = 0) {
    let num = +str;
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(fix) + ' B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(fix) + ' M';
    } else {
        return num.toFixed(fix);
    }
}
//Remove leading zeros from the numerical value
export function toCutFrontZero(num: string) {
    let str = num + "";
    while (str.length > 1 && str.startsWith('0') && str[1] !== ".") {
        str = str.slice(1);
    }
    return str;
}
//Get deadline
export function getDeadLine(delay: number) {
    return Math.floor(new Date().getTime() / 1000 + 60 * delay);
}
//Asynchronous delay
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
//Get the current device type: 0 for PC, 1 for Mobile
export function getDeviceType() {
    let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    return flag ? 1 : 0;
}
/**
 * Format time
 * @param timestamp 
 * @param formatStr "ddd, MMM D, YYYY, h:mm:ss A"|'YYYY/MM/DD HH:mm:ss'
 */
export function formatTime(timestamp: number, formatStr: string) {
    if (timestamp.toString().length === 10) {
        timestamp = timestamp * 1000;
    }
    return dayjs(timestamp).format(formatStr);
}
//log
let isPrintf = localStorage.getItem("printf");

export function printf(message?: string, ...optionalParams: any[]) {
    if (isPrintf) {
        console.log(`%cLog%c${formatTime(Date.now(), "HH:mm:ss")}%c${message}`,
            'display: inline-block;background-color:rgba(66,66,66,1);color:#fff;margin-bottom:6px;padding:4px;border-radius:4px 0 0 4px',
            'display: inline-block;background-color:rgba(0,180,0,1);color:#fff;padding:4px;border-radius:0 4px 4px 0',
            'font-size:16px;color:#fff;background:linear-gradient(to right,red,blue);margin-left: 15px;',
            ...optionalParams);
    }
}
/**
 * Encapsulate requests
 * @param url 
 * @param query body | null
 * @returns 
 */
export async function request(url: string, query?: object) {
    try {
        const token = localStorage.getItem("token") ?? "";
        let requestOptions: RequestInit = {
            method: query ? "POST" : "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: query ? JSON.stringify(query) : undefined
        };
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            return { message: "Network response was not ok" };
        }
        return response.json();
    } catch (error) {
        return { message: error };
    }
}