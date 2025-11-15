'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface ComboboxOption {
  value: string
  label: string
  searchText?: string
}

interface ComboboxProps {
  value?: string
  onValueChange: (value: string) => void
  options: ComboboxOption[]
  placeholder?: string
  emptyMessage?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
}

export function Combobox({
  value,
  onValueChange,
  options,
  placeholder = 'Select option...',
  emptyMessage = 'No option found.',
  searchPlaceholder = 'Search...',
  disabled = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)

  // オプションを検索用テキストでソート
  const sortedOptions = useMemo(() => {
    return options.sort((a, b) => a.label.localeCompare(b.label))
  }, [options])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex h-10 w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:border-secondary disabled:cursor-not-allowed disabled:opacity-50 hover:bg-background shadow-none',
            className
          )}
          disabled={disabled}
        >
          {selectedOption ? (
            <span>{selectedOption.label}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {sortedOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.searchText || option.label}
                  onSelect={() => {
                    onValueChange(option.value === value ? '' : option.value)
                    setOpen(false)
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
