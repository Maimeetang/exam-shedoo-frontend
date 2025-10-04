interface props {
  text: string;
  onClick?: () => void;
}

export function OrangeButton({ text, onClick }: props) {
  return (
    <button className="cursor-pointer rounded-2xl px-3 py-1 bg-[#F7A97B] text-[#303030]" onClick={onClick}>
      {text}
    </button>
  )
}

export function GreenButton({ text }: props) {
  return (
    <button className="cursor-pointer rounded-2xl px-3 py-1 bg-[#B6D2D6] text-[#303030]">
      {text}
    </button>
  )
}

export function BlueButton({ text }: props) {
  return (
    <button className="cursor-pointer rounded-2xl px-3 py-1 bg-[#3F5167] text-[#FFFFFF]">
      {text}
    </button>
  )
}

