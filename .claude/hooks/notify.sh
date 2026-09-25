#!/usr/bin/env bash
# notify.sh — cross-platform notification wrapper.
# Detects OS and uses whatever native notifier is available. Fails silently
# if nothing is installed, so it's always safe to call.
#
# Usage: notify.sh "Title" "Message" "Sound" "Group"
#
# Supported platforms:
#   macOS   — terminal-notifier (brew install terminal-notifier)
#   WSL     — wsl-notify, or PowerShell toast fallback
#   Windows — PowerShell toast notifications (built-in)
#   Linux   — notify-send (optional)

TITLE="${1:-Claude Code}"
MESSAGE="${2:-Task complete}"
SOUND="${3:-default}"
GROUP="${4:-claude}"

if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v terminal-notifier &> /dev/null; then
        terminal-notifier \
            -title "$TITLE" \
            -message "$MESSAGE" \
            -sound "$SOUND" \
            -group "$GROUP" \
            -activate com.apple.Terminal \
            > /dev/null 2>&1 &
    fi

elif [[ "$OSTYPE" == "linux-gnu"* ]] && grep -q microsoft /proc/version 2>/dev/null; then
    if command -v wsl-notify &> /dev/null; then
        wsl-notify "$TITLE" "$MESSAGE" &
    else
        powershell.exe -Command "
            [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
            [Windows.UI.Notifications.ToastNotification, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
            [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null

            \$template = @\"
<toast>
    <visual>
        <binding template='ToastText02'>
            <text id='1'>$TITLE</text>
            <text id='2'>$MESSAGE</text>
        </binding>
    </visual>
</toast>
\"@

            \$xml = New-Object Windows.Data.Xml.Dom.XmlDocument
            \$xml.LoadXml(\$template)
            \$toast = New-Object Windows.UI.Notifications.ToastNotification \$xml
            [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('Claude Code').Show(\$toast)
        " 2>/dev/null &
    fi

elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    powershell.exe -Command "
        [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
        [Windows.UI.Notifications.ToastNotification, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
        [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null

        \$template = @\"
<toast>
    <visual>
        <binding template='ToastText02'>
            <text id='1'>$TITLE</text>
            <text id='2'>$MESSAGE</text>
        </binding>
    </visual>
</toast>
\"@

        \$xml = New-Object Windows.Data.Xml.Dom.XmlDocument
        \$xml.LoadXml(\$template)
        \$toast = New-Object Windows.UI.Notifications.ToastNotification \$xml
        [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('Claude Code').Show(\$toast)
    " 2>/dev/null &

elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v notify-send &> /dev/null; then
        notify-send "$TITLE" "$MESSAGE" &
    fi
fi

exit 0
