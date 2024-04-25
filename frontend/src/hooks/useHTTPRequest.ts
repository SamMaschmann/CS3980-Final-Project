import axios from "axios";
import { useEffect, useState } from "react";

export async function useHTTPRequest(
  url: string,
  data: JSON,
  action: "PUT" | "DELETE" | "POST"
) {
  try {
    let res;
    if (action === "DELETE") {
      res = await axios.delete(url);
    } else if (action === "POST") {
      res = await axios.post(url, data);
    } else if (action === "PUT") {
      res = await axios.put(url, data);
    }

    const res_data = await res.data;

    return res_data;
  } catch (err) {
    return err;
  }
}
