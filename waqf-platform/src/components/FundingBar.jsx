export default function FundingBar({ raised, goal }) {
  const pct = Math.min(100, Math.round((raised / goal) * 100))
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-gray-500">التمويل المُجمَّع</span>
        <span className="font-bold text-[#1B4332]">{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1B4332] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{(raised / 1000000).toFixed(1)} م دج</span>
        <span>الهدف: {(goal / 1000000).toFixed(0)} م دج</span>
      </div>
    </div>
  )
}
