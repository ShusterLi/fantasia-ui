import type { Component, DefineComponent } from 'vue'

type ResultStatus = 'success' | 'error' | 'warning' | 'info' | '403' | '404' | '500'

interface FResultProps {
	status?: ResultStatus
	title?: string
	subTitle?: string
	icon?: Component | DefineComponent | string
}

export type { ResultStatus, FResultProps }
