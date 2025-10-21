import { useGetApi } from "@/lib/apiCallerClient";
import { useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

function Test() {
    const getApi = useGetApi();
    const [res, setRes] = useState<any>("Null");
    const handleTest = async () => {
        const res = await getApi(`${BACKEND_URL}/api/test`);
        if(res.data.flag){
            setRes("Admin");
        }
        else{
            setRes("Not Admin");
        }

    }
    return (
        <>
        <button onClick={handleTest}>Test</button>
        <p>{res}</p>
        </>
    )
}

export default Test;