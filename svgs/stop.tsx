import { ComponentProps } from "react"

export const Stop = (props: ComponentProps<"svg">) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.708 9a1.51 1.51 0 0 0-.294-.414C14.828 8 13.886 8 12 8c-1.886 0-2.828 0-3.414.586C8 9.172 8 10.114 8 12c0 1.886 0 2.828.586 3.414C9.172 16 10.114 16 12 16c1.886 0 2.828 0 3.414-.586c.472-.471.564-1.174.582-2.414"
        stroke="white"
        stroke-width="1.5"
      />
      <path
        d="M7 3.338A9.954 9.954 0 0 1 12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.821.487-3.53 1.338-5"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  )
}
