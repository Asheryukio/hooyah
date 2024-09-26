// const baseurl = "https://api-hooyah.bba.sh";
const baseurl = "https://api-web3.hooyah.io";
/**
 * Encapsulate requests
 * @param url 
 * @param query body | null
 * @returns 
 */
export async function request(url: string, query?: object,isGet:boolean = false) {
    try {
        const token = localStorage.getItem("token") ?? "";
        const requestOptions: RequestInit = {
            method: isGet ? "GET" : (query ? "POST" : "GET"),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: query ? JSON.stringify(query) : undefined,
            redirect: "follow"
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

export async function login(address: string, signature: string,timestamp:string) {
    const url = baseurl+"/login";
    const data = await request(url,{
        address,
        timestamp,
        signature
    });

    if (data.code === 200) {
        localStorage.setItem("token", data.data.token);
    }
    return data;
}

export async function bindAddress(email: string,name:string) {
    const url = baseurl+"/bindAddress";
    const data = await request(url,{
        email,name
    });
    return data;
}

//addOrder order:"SOL"
export async function addOrder(order: string) {
    const url = baseurl+"/addOrder";
    const data = await request(url,{payCoin:order,amount:1000});
    return data;
}

//payOrder {orderId:1}
export async function payOrder(orderId: string, txHash: string) {
    const url = baseurl+"/payOrder";
    const data = await request(url,{orderId,txHash});
    return data;
}

//checkOrder {orderId:1}
export async function queryOrder(orderId: string) {
    const url = baseurl+"/queryOrder?orderId="+orderId;
    const data = await request(url);
    return data;
}
