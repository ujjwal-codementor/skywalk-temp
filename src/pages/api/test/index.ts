import { checkAdmin } from "@/lib/checkAdmin";
import { NextApiRequest, NextApiResponse } from "next";

async function Handle(req: NextApiRequest, res: NextApiResponse) {
    const flag = checkAdmin(req);
    // console.log(flag);
    return res.status(200).json({ flag });
}

export default Handle;

