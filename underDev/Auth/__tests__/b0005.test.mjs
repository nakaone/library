import { describe, it, expect, vi } from "vitest";
import { authClient } from "../authClient.mjs";
import { cryptoClient } from "../src/client/cryptoClient.mjs";

describe("b0005 init flow", () => {

  it("初回 init で SPkey / deviceId が保存される", async () => {
    const client = await authClient.initialize({
      adminMail: "x",
      adminName: "y",
      api: "z"
    });

   // 通信のみモック
   vi.spyOn(client, "fetch").mockResolvedValue({
     SPkey: "SERVER_PUBLIC_KEY",
     deviceId: "DEVICE_UUID_FROM_SERVER"
   });

    await client.exec();

    expect(client.idb.SPkey).toBe("SERVER_PUBLIC_KEY");
    expect(client.idb.deviceId).toBe("DEVICE_UUID_FROM_SERVER");
  });
});
