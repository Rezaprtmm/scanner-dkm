import { Camera, Submit } from "@/svgs"
import Image from "next/image"
export default function Hello() {
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
          <div className="flex h-[300px] w-full flex-col rounded-[20px] bg-white px-[20px] lg:h-[410px] lg:w-1/2">
            <div className="flex w-full items-center justify-between pt-[20px] lg:mt-[20px] lg:pt-0">
              <p className="text-[17px] font-semibold leading-[120%] text-ribbon-600 lg:text-[27px]">
                QR Scanner
              </p>
              <div>
                <button className="flex gap-[5px] rounded-[4px] bg-ribbon-600 px-[12px] py-[5px] text-[12px] text-white lg:gap-[10px] lg:px-[20px] lg:py-[10px]">
                  <Camera />
                  Scan
                </button>
              </div>
            </div>
            <div className="mt-[20px] flex h-[210px] w-full flex-col rounded-[10px] border-[1px] border-dashed border-[#737373] bg-[#F8F8F8] lg:h-[308px]">
              <div className="my-auto flex justify-center">
                <p className="text-[12px] font-normal leading-[120%]">
                  make sure to allow camera access
                </p>
              </div>
            </div>
          </div>
          <div className="mt-[20px] flex h-[300px] w-full flex-col rounded-[20px] bg-white px-[20px] lg:mt-0 lg:h-[410px] lg:w-1/2">
            <div className="flex w-full items-center justify-between pt-[20px] lg:mt-[20px] lg:pt-0">
              <p className="text-[17px] font-semibold leading-[120%] text-ribbon-600 lg:text-[27px]">
                Scan Result
              </p>
              <div>
                <button className="flex gap-[5px] rounded-[4px] bg-[#737373] px-[12px] py-[5px] text-[12px] text-white lg:gap-[10px] lg:px-[20px] lg:py-[10px]">
                  <Submit />
                  Submit
                </button>
              </div>
            </div>
            <div className="mt-[20px] flex h-[210px] w-full flex-col rounded-[10px] border-[1px] border-dashed border-[#737373] bg-[#F8F8F8] lg:h-[308px]">
              <div className="flex px-[20px]">
                <p className="mt-[20px] text-[12px] font-normal leading-[120%]">
                  Scan a QR code to view the results here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
