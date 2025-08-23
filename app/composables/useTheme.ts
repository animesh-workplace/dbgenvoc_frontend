export const useTheme = () => {
	const colorMode = useState<'light' | 'dark'>('color-mode', () => 'light')

	const apply = (mode: 'light' | 'dark') => {
		colorMode.value = mode
		const root = document.documentElement
		if (mode === 'dark') root.classList.add('dark')
		else root.classList.remove('dark')
		// Optional: persist
		localStorage.setItem('color-mode', mode)
	}

	const toggle = () => apply(colorMode.value === 'light' ? 'dark' : 'light')

	onMounted(() => {
		const saved = localStorage.getItem('color-mode') as 'light' | 'dark' | null
		apply(saved ?? 'light')
	})

	return { colorMode, toggle, apply }
}
