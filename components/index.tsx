"use client"
import { Camera, Submit, Stop } from "@/svgs"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import jsQR from "jsqr"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"

const Hello = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scannedData, setScannedData] = useState<string>("")
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false)
  const [isDataShown, setIsDataShown] = useState<boolean>(false)
  const isCameraActiveRef = useRef<boolean>(false)
  let videoStream: MediaStream | null = null

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoStream = stream
          videoRef.current.srcObject = stream
          videoRef.current.play()
          isCameraActiveRef.current = true
        }
      })
      .catch((error) => {
        console.error("Kesalahan akses kamera:", error)
      })
  }

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => {
        track.stop()
      })
      isCameraActiveRef.current = false
      setIsCameraActive(false)
    }
  }

  useEffect(() => {
    const scanQRCode = () => {
      const video = videoRef.current

      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        context?.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = context?.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        )
        const code = jsQR(
          imageData?.data as Uint8ClampedArray,
          canvas.width,
          canvas.height
        )

        if (code) {
          setScannedData("," + code.data)
          setIsDataShown(true)
          setIsCameraActive(false)
        }
      }

      if (isCameraActiveRef.current) {
        requestAnimationFrame(scanQRCode)
      }
    }

    if (isCameraActive) {
      startCamera()
      isCameraActiveRef.current = true
      requestAnimationFrame(scanQRCode)
    }

    return () => {
      stopCamera()
    }
  }, [isCameraActive])

  let pData = JSON.stringify({ scannedData })
  let split = pData.split(",")
  let head = split[1]
  let name = split[2]
  let email = split[3]
  let inst = split[4]
  let role = split[5]
  let msg = `Nama: ${name} <br> Email: ${email} <br> Institution: ${inst} <br> Role: ${role}`

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (
      head == "DKM-REG" &&
      name != "" &&
      email != "" &&
      inst != "" &&
      role != ""
    ) {
      try {
        setIsDataShown(false)
        toast.success("Absensi berhasil. Enjoy your time here!")
        const response = await axios.post("/api/saveData", {
          name,
          email,
          inst,
          role,
        })
        console.log(response.data)
      } catch (error) {
        console.error(error)
        toast.warning("Absensi gagal. Coba lagi.") // Handle any errors
      }
    } else {
      toast.warning("QR Code tidak valid. Coba lagi.")
      setIsDataShown(false)
    }
  }

  return (
    <div className="h-[110vh] w-full bg-primary-600 lg:h-[100vh]">
      <div className="container mx-auto block px-6 lg:flex lg:w-full lg:flex-col">
        <div className="absolute left-[0px] right-0 top-[560px] lg:top-[365px]">
          <Image
            src="/images/bubble-scan1.png"
            width={200}
            height={200}
            alt="bubble"
            className="w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="absolute right-0 top-[140px] lg:top-[110px]">
          <Image
            src="/images/bubble-scan2.png"
            width={200}
            height={200}
            alt="bubble"
            className="w-[150px] lg:w-[400px]"
          />
        </div>
        <h1 className="pt-[77px] text-center text-[21px] font-semibold leading-[120%] text-ribbon-600 lg:mt-[77px] lg:pt-0 lg:text-[36px]">
          QR Scanner For DKM Registration <br className="block md:hidden" />{" "}
          System
        </h1>
        <div className="relative mt-[40px] w-full lg:mt-[85px] lg:flex lg:gap-[20px]">
          <div className="flex h-[333px] w-full flex-col rounded-[20px] bg-white px-[20px] lg:h-[488px] lg:w-1/2">
            <div className="flex w-full items-center justify-between pt-[20px] lg:mt-[20px] lg:pt-0">
              <p className="text-[17px] font-semibold leading-[120%] text-ribbon-600 lg:text-[27px]">
                QR Scanner
              </p>
              <div>
                {isCameraActive ? (
                  <button
                    className="flex gap-[5px] rounded-[4px] bg-[#FFAA00] px-[12px] py-[5px] text-[12px] text-white lg:gap-[10px] lg:px-[20px] lg:py-[10px]"
                    onClick={() => setIsCameraActive(false)}
                  >
                    <Stop />
                    <p>Stop</p>
                  </button>
                ) : (
                  <button
                    className="flex gap-[5px] rounded-[4px] bg-ribbon-600 px-[12px] py-[5px] text-[12px] text-white lg:gap-[10px] lg:px-[20px] lg:py-[10px]"
                    onClick={() => setIsCameraActive(true)}
                  >
                    <Camera />
                    <p>Scan</p>
                  </button>
                )}
              </div>
            </div>
            <div className="mt-[20px] flex h-[245px] w-full flex-col rounded-[10px] border-[1px] border-dashed border-[#737373] bg-[#F8F8F8] lg:h-[388px]">
              <div className="my-auto flex justify-center">
                {!isCameraActive && (
                  <p className="text-[12px] font-normal leading-[120%] text-[#737373]">
                    click the scan button to start scanning
                  </p>
                )}

                {isCameraActive && (
                  <video
                    className="h-auto w-[100%] rounded-[10px]"
                    ref={videoRef}
                  ></video>
                )}
              </div>
            </div>
          </div>

          <div className="mt-[20px] flex h-[333px] w-full flex-col rounded-[20px] bg-white px-[20px] lg:mt-0 lg:h-[488px] lg:w-1/2">
            <div className="flex w-full items-center justify-between pt-[20px] lg:mt-[20px] lg:pt-0">
              <p className="text-[17px] font-semibold leading-[120%] text-ribbon-600 lg:text-[27px]">
                Scan Result
              </p>
              <form onSubmit={handleSubmit}>
                <div>
                  {isDataShown ? (
                    <button
                      className="flex gap-[5px] rounded-[4px] bg-[#0066FF] px-[12px] py-[5px] text-[12px] text-white lg:gap-[10px] lg:px-[20px] lg:py-[10px]"
                      type="submit"
                      disabled={false}
                    >
                      <Submit />
                      Submit
                    </button>
                  ) : (
                    <button
                      className="flex gap-[5px] rounded-[4px] bg-[#737373] px-[12px] py-[5px] text-[12px] text-white lg:gap-[10px] lg:px-[20px] lg:py-[10px]"
                      type="submit"
                      disabled={true}
                    >
                      <Submit />
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div className="mt-[20px] flex h-[245px] w-full flex-col rounded-[10px] border-[1px] border-[#737373] bg-[#F8F8F8] lg:h-[388px]">
              <div className="flex px-[20px]">
                {!isDataShown && (
                  <p className="mt-[20px] text-[12px] font-normal leading-[120%] text-[#737373]">
                    Scan a QR code to view the results here.
                  </p>
                )}
                {isDataShown && (
                  <p
                    className="pt-[20px] text-[#737373]"
                    dangerouslySetInnerHTML={{ __html: msg }}
                  ></p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Hello
