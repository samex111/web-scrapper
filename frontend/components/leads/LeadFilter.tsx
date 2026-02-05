export default function LeadFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return(
        <div>
            <input type="text" value={value} onChange={(e)=>onChange(e.target.value)}/>
        </div>
    )
}