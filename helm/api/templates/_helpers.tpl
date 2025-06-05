{{- define "search-api.name" -}}
{{ default .Chart.Name .Values.nameOverride }}
{{- end -}}

{{- define "search-api.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{ .Values.fullnameOverride }}
{{- else -}}
{{- $name := include "search-api.name" . -}}
{{- if contains $name .Release.Name -}}
{{ $name }}
{{- else -}}
{{ printf "%s-%s" .Release.Name $name }}
{{- end -}}
{{- end -}}
{{- end -}}
