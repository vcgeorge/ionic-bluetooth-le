import {
  BleClient,
  // dataViewToNumbers,
  // numbersToDataView,
  numberToUUID,
  type ScanResult,
} from "@capacitor-community/bluetooth-le";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import React, { useEffect, useMemo, useRef, useState } from "react";

const CALOPAD_SERVICE = "0000fe59-0000-1000-8000-00805f9b34fb";
// const HEART_RATE_SERVICE = "0000180d-0000-1000-8000-00805f9b34fb";
// const HEART_RATE_MEASUREMENT_CHARACTERISTIC =
//   "00002a37-0000-1000-8000-00805f9b34fb";
// const BODY_SENSOR_LOCATION_CHARACTERISTIC =
//   "00002a38-0000-1000-8000-00805f9b34fb";
const BATTERY_SERVICE = numberToUUID(0x180f);
const BATTERY_CHARACTERISTIC = numberToUUID(0x2a19);
// const POLAR_PMD_SERVICE = "fb005c80-02e7-f387-1cad-8acd2d8df0c8";
// const POLAR_PMD_CONTROL_POINT = "fb005c81-02e7-f387-1cad-8acd2d8df0c8";

function BleComponent() {
  const devicesList = useRef<ScanResult[] | []>([]);
  const [devices, setDevicesList] = useState<ScanResult[] | []>([]);
  const [deviceStatus, setDeviceStatus] = useState<string>("");

  console.log("deviceStatus", deviceStatus);
  const initBle = async () => {
    // devicesList.current = [];
    // setDevicesList([]);
    try {
      await BleClient.initialize({
        androidNeverForLocation: true,
      });

      const isEnabled = await BleClient.isEnabled();

      console.log("isEnabled", isEnabled);

      const connectedDevices = await BleClient.getDevices([
        "E3:F4:FC:EF:B0:B6",
      ]);

      console.log("getConnectedDevices", connectedDevices);

      await BleClient.requestLEScan(
        {
          // name: "OnePlus Bullets Wireless Z",
          name: "Calopad",
          // services: ["00000118-0000-1000-8000-00805f9b34fb"],
          // optionalServices: ["00000118-0000-1000-8000-00805f9b34fb"],
        },
        (result: ScanResult) => {
          if (result?.localName) {
            console.log("scanned", result, result?.uuids, devicesList.current);
            const isDeviceId = devicesList.current?.find(
              (device: ScanResult) =>
                device?.device?.deviceId === result?.device?.deviceId
            );
            if (result && result?.localName && !isDeviceId) {
              devicesList.current = [...devicesList.current, result];
              setDevicesList(devicesList.current);
            }
          }
        }
      );

      // const devices = await BleClient.getConnectedDevices([]);
      // console.log("devices", devices);

      // const device = await BleClient.requestDevice({
      //   // name: "Calopad",
      //   services: ["0000180d-0000-1000-8000-00805f9b34fb"],
      //   // optionalServices: [BODY_SENSOR_LOCATION_CHARACTERISTIC],
      // });

      // connect to device, the onDisconnect callback is optional
      // await BleClient.connect(device.deviceId, (deviceId) =>
      //   onDisconnect(deviceId)
      // );
      // console.log("connected to device", device);

      // const result = await BleClient.read(
      //   device.deviceId,
      //   HEART_RATE_SERVICE,
      //   BODY_SENSOR_LOCATION_CHARACTERISTIC
      // );
      // console.log("body sensor location", result.getUint8(0));

      // const battery = await BleClient.read(
      //   device.deviceId,
      //   BATTERY_SERVICE,
      //   BATTERY_CHARACTERISTIC
      // );
      // console.log("battery level", battery.getUint8(0));

      // await BleClient.write(
      //   device.deviceId,
      //   POLAR_PMD_SERVICE,
      //   POLAR_PMD_CONTROL_POINT,
      //   numbersToDataView([1, 0])
      // );
      // console.log("written [1, 0] to control point");

      // await BleClient.startNotifications(
      //   device.deviceId,
      //   HEART_RATE_SERVICE,
      //   HEART_RATE_MEASUREMENT_CHARACTERISTIC,
      //   (value) => {
      //     console.log("current heart rate", parseHeartRate(value));
      //   }
      // );

      // disconnect after 10 sec
      // setTimeout(async () => {
      //   await BleClient.stopNotifications(
      //     device.deviceId,
      //     HEART_RATE_SERVICE,
      //     HEART_RATE_MEASUREMENT_CHARACTERISTIC
      //   );
      //   await BleClient.disconnect(device.deviceId);
      //   console.log("disconnected from device", device);
      // }, 10000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    initBle();
  }, []);

  function onDisconnect(deviceId: string): void {
    console.log(`device ${deviceId} disconnected`);
  }

  function parseHeartRate(value: DataView): number {
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let heartRate: number;
    if (rate16Bits > 0) {
      heartRate = value.getUint16(1, true);
    } else {
      heartRate = value.getUint8(1);
    }
    return heartRate;
  }

  // const devices = useMemo(() => {
  //   console.log("devicesList.current");
  //   return devicesList.current;
  // }, [devicesList.current?.length]);

  useEffect(() => {
    console.log("devicesList.current");
  }, [devicesList.current?.length]);

  const connectToDevice = async (deviceId: string) => {
    console.log(deviceId);
    if (!deviceId) return;

    try {
      // Connect to the device
      await BleClient.connect(deviceId, (deviceId) => {
        onDisconnect(deviceId);
        // Discover device services and characteristics
        // BleClient.discoverServices(deviceId)
        //   .then((deviceInfo: any) => {
        //     setDeviceStatus(
        //       `Discovered device info ==>: ${JSON.stringify(deviceInfo)}`
        //     );

        //     // Read a specific characteristic (replace 'characteristicUuid' with the actual UUID)
        //     BleClient.read(
        //       deviceId,
        //       deviceInfo?.services?.[0]?.characteristics?.[0]?.serviceUuid,
        //       "00002a00-0000-1000-8000-00805f9b34fb"
        //     )
        //       .then((value) => {
        //         setDeviceStatus(`Characteristic Value: ${value}`);
        //       })
        //       .catch((error) => {
        //         setDeviceStatus(
        //           `Error reading characteristic: ${error.message}`
        //         );
        //       });
        //   })
        //   .catch((error) => {
        //     setDeviceStatus(
        //       `Error discovering characteristics: ${error.message}`
        //     );
        //   });
      });
    } catch (error) {
      console.error("Error connecting to the device:", error);
      setDeviceStatus("Error connecting to the device.");
    }

    await BleClient.discoverServices(deviceId).then((data) => {
      console.log("discoverServices ==> ", data);
      console.log(`Discovered device info ==>: ${JSON.stringify(data)}`);
    });

    await BleClient.startNotifications(
      deviceId,
      "00001800-0000-1000-8000-00805f9b34fb",
      "00002a00-0000-1000-8000-00805f9b34fb",
      (value) => {
        console.log("current heart rate", parseHeartRate(value));
      }
    );
  };

  const disConnectToDevice = async (deviceId: string) => {
    if (!deviceId) return;
    await BleClient.disconnect(deviceId);
  };

  const getBatteryPercentage = async (deviceId: string) => {
    if (!deviceId) return;
    const battery = await BleClient.read(
      deviceId,
      BATTERY_SERVICE,
      BATTERY_CHARACTERISTIC
    );
    console.log("battery level", battery.getUint8(0));
  };

  const getServices = async (deviceId: string) => {
    if (!deviceId) return;
    const services = await BleClient.getServices(deviceId);
    console.log("Services", services);
  };

  const readServices = async (deviceId: string) => {
    if (!deviceId) return;
    const result = await BleClient.read(
      deviceId,
      "00001800-0000-1000-8000-00805f9b34fb",
      "00002a00-0000-1000-8000-00805f9b34fb"
    );
    console.log("body sensor location", result.getUint8(3));
    const view = new Int32Array(result.getUint8(8));

    console.log("Services", result, view);
  };

  const onStopSearch = async () => {
    await BleClient.stopLEScan();
  };

  return (
    // <IonGrid>
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Available Devices </IonCardTitle>
        <IonButton onClick={initBle}>Search </IonButton>
        <IonButton onClick={onStopSearch}>Stop Search</IonButton>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          {devices?.map((device, key) => {
            return (
              <IonItem key={key}>
                <IonLabel>{device?.localName}</IonLabel>
                <IonGrid>
                  <IonButton
                    onClick={() => disConnectToDevice(device?.device?.deviceId)}
                  >
                    DisConnect
                  </IonButton>
                  <IonButton
                    onClick={() => connectToDevice(device?.device?.deviceId)}
                  >
                    Connect
                  </IonButton>
                  <IonButton
                    onClick={() => readServices(device?.device?.deviceId)}
                  >
                    Read Services
                  </IonButton>
                  <IonButton
                    onClick={() => getServices(device?.device?.deviceId)}
                  >
                    Services
                  </IonButton>

                  <IonButton
                    onClick={() =>
                      getBatteryPercentage(device?.device?.deviceId)
                    }
                  >
                    Battery
                  </IonButton>
                  <IonButton
                    onClick={async () =>
                      await BleClient.createBond(device?.device?.deviceId)
                    }
                  >
                    Create Bond
                  </IonButton>
                </IonGrid>
              </IonItem>
            );
          })}
        </IonList>
      </IonCardContent>
    </IonCard>
    // </IonGrid>
  );
}

export default BleComponent;
