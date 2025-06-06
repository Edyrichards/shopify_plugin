{{- define "search-admin.name" -}}
{{ default .Chart.Name .Values.nameOverride }}
{{- end -}}

{{- define "search-admin.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{ .Values.fullnameOverride }}
{{- else -}}
{{- $name := include "search-admin.name" . -}}
{{- if contains $name .Release.Name -}}
{{ $name }}
{{- else -}}
{{ printf "%s-%s" .Release.Name $name }}
{{- end -}}
{{- end -}}
{{- end -}}
