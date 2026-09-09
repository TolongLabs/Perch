import { type ReactNode, useEffect, useId, useRef, useState } from 'react'
import './Ui.css'

/**
 * The only home for a card's caption. `DESIGN.md`: the hero gets none at all, and everywhere else the explanation sits
 * beside the heading rather than under it. Opens on hover and on focus, because a caption only a mouse can read is a
 * caption half the readers never get.
 */
export const Info = ({ children, label = 'What this is' }: { children: ReactNode; label?: string }) => {
  const id = useId()
  const dot = useRef<HTMLButtonElement>(null)
  const [at, setAt] = useState<{ left: number; top: number; below: boolean } | null>(null)

  // Positioned against the viewport rather than the dot, and clamped to it. A tooltip anchored to its trigger runs off
  // a 390px screen the moment the trigger sits anywhere but the left margin, and every one of ours sits beside a
  // heading somewhere in the middle of a card.
  const place = () => {
    const r = dot.current?.getBoundingClientRect()
    if (!r) return
    const width = Math.min(280, window.innerWidth - 32)
    const left = Math.min(Math.max(16, r.left + r.width / 2 - width / 2), window.innerWidth - width - 16)
    // Below the trigger by default, and above only when there is no room below. Every one of these dots sits inside
    // the label it explains, so opening upward put the sentence over the heading a reader had just pressed - on a day
    // column, over the day's own number and date. 140 is a conservative three-line bubble.
    const below = window.innerHeight - r.bottom >= 140
    setAt({ left, top: below ? r.bottom : r.top, below })
  }

  const close = () => setAt(null)

  return (
    <span className="info">
      <button
        type="button"
        ref={dot}
        className="info-dot"
        aria-label={label}
        aria-describedby={at ? id : undefined}
        aria-expanded={at !== null}
        onMouseEnter={place}
        onMouseLeave={close}
        onFocus={place}
        onBlur={close}
        onClick={() => (at ? close() : place())}
      >
        i
      </button>
      {at && (
        <span
          className="info-bubble"
          id={id}
          role="tooltip"
          data-below={at.below}
          style={{ left: at.left, top: at.top }}
        >
          {children}
        </span>
      )}
    </span>
  )
}

/** A heading and its tooltip are one unit, so nothing else has to know the pairing exists. */
export const Heading = ({
  kicker,
  children,
  info,
  as: As = 'h2'
}: {
  kicker?: string
  children: ReactNode
  info?: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'p'
}) => (
  <div className="head-row">
    {kicker && <p className="t-label head-kicker">{kicker}</p>}
    {/* The bubble sits beside the heading, not inside it. A button inside a heading is part of that heading's
        accessible name, so every titled surface announced its own name with the bubble's on the end of it. */}
    <div className="head-title">
      <As className="head-text">{children}</As>
      {info && <Info>{info}</Info>}
    </div>
  </div>
)

export const Field = ({
  label,
  type = 'text',
  placeholder,
  autoComplete,
  disabled,
  help,
  value,
  onChange
}: {
  label: string
  type?: string
  placeholder?: string
  autoComplete?: string
  disabled?: boolean
  /** An instruction attached to the control, not a caption: it says how to answer, so it cannot survive being hidden. */
  help?: string
  value?: string
  onChange?: (v: string) => void
}) => {
  const id = useId()
  const helpId = useId()
  return (
    <div className="field">
      <label className="t-label field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="field-input"
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-describedby={help ? helpId : undefined}
        {...(onChange ? { value: value ?? '', onChange: (e) => onChange(e.target.value) } : {})}
      />
      {help && (
        <p className="t-specimen field-help" id={helpId}>
          {help}
        </p>
      )}
    </div>
  )
}

export const Check = ({
  label,
  detail,
  defaultChecked,
  checked,
  onChange
}: {
  label: string
  /** The value this item was read off the trip from. A record for the row, so it stays inline. */
  detail?: ReactNode
  defaultChecked?: boolean
  /** Pass with `onChange` to drive the box from outside. Without it the box keeps its own state. */
  checked?: boolean
  onChange?: (next: boolean) => void
}) => {
  const id = useId()
  const [own, setOwn] = useState(defaultChecked === true)
  const controlled = checked !== undefined
  const on = controlled ? checked : own

  // The input stays, hidden, because its keyboard handling and form semantics are not worth reimplementing. Only the
  // box is ours, which is what `DESIGN.md` asks for: nothing native is left *styled* by the browser.
  return (
    <div className="check">
      <input
        id={id}
        className="check-input"
        type="checkbox"
        checked={on}
        onChange={(e) => (controlled ? onChange?.(e.target.checked) : setOwn(e.target.checked))}
      />
      <label className="check-label" htmlFor={id}>
        <span className="check-box" data-on={on} aria-hidden="true" />
        <span className="check-text">
          <span className="check-name">{label}</span>
          {detail && <span className="t-specimen check-detail">{detail}</span>}
        </span>
      </label>
    </div>
  )
}

export type Option = { value: string; label: string }

/**
 * A drawn listbox, not a `<select>`. `DESIGN.md` puts every native control out, and the operating system's dropdown is
 * the single element that most obviously was not looked at.
 */
export const Select = ({
  label,
  options,
  value,
  onChange
}: {
  label: string
  options: Option[]
  value: string
  onChange: (v: string) => void
}) => {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const current = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('pointerdown', away)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  return (
    <div className="select" ref={box}>
      <p className="t-label field-label">{label}</p>
      <button type="button" className="select-trigger" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span>{current?.label ?? 'Choose'}</span>
        <span className="select-caret" aria-hidden="true" />
      </button>

      {open && (
        <div className="select-list" role="listbox" aria-label={label} tabIndex={-1}>
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              className="select-option"
              role="option"
              aria-selected={o.value === value}
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export type Chip = { id: string; label: string; disabled?: boolean }

/**
 * Pills with a 3px outline and a 10 percent tint when on. A chip that cannot be picked is drawn at reduced opacity and
 * the group carries a note saying why, because a control that is off for a reason the reader cannot see is just broken.
 */
export const ChipGroup = ({
  label,
  chips,
  selected,
  onToggle,
  note
}: {
  label: string
  chips: Chip[]
  selected: string[]
  onToggle: (id: string) => void
  /** A limitation, so it sits inline where it cannot be missed rather than in a tooltip. */
  note?: string
}) => (
  <fieldset className="chips">
    <legend className="t-label chips-legend">{label}</legend>
    <div className="chips-row">
      {chips.map((c) => (
        <button
          key={c.id}
          type="button"
          className="chip"
          aria-pressed={selected.includes(c.id)}
          disabled={c.disabled === true}
          onClick={() => onToggle(c.id)}
        >
          {c.label}
        </button>
      ))}
    </div>
    {note && <p className="t-specimen chips-note">{note}</p>}
  </fieldset>
)
