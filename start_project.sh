#!/bin/bash

# 獲取腳本所在的目錄，確保路徑正確
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$SCRIPT_DIR"

# --- 後端設定 ---
echo "正在啟動 Flask 後端..."

# 激活 Python 虛擬環境
# 假設您的虛擬環境在專案根目錄的 .venv 資料夾中
source "$PROJECT_ROOT/.venv/bin/activate"

# 啟動 Flask 應用程式。
# 請將 'python "$PROJECT_ROOT/app.py"' 替換為您實際啟動 Flask 後端的指令。
# 常見的啟動方式有：
# 1. 如果您的 Flask 應用程式入口點是專案根目錄下的 `app.py`：
#    python "$PROJECT_ROOT/app.py" &
# 2. 如果您使用 'flask run' 命令 (通常需要設定 FLASK_APP 環境變數)：
#    export FLASK_APP="$PROJECT_ROOT/app.py" # 根據您的實際入口檔案調整 'app.py'
#    flask run &
# 3. 如果您的後端在 'backend/' 子目錄中，例如 `backend/app.py`：
#    python "$PROJECT_ROOT/backend/app.py" &


# 根據您提供的指示，使用 'flask run'。假設您的 Flask 應用入口點是 'app.py'。
# 如果您的 Flask 應用程式主檔案不是 app.py，請修改 FLASK_APP 的值。
export FLASK_APP=app.py
flask run --port 5007&
FLASK_PID=$!
echo "Flask 後端已啟動，PID: $FLASK_PID"

# 停用虛擬環境，避免與 Node.js 工具產生潛在衝突
deactivate

echo "等待後端初始化 (可選，根據需要調整延遲時間)..."
sleep 3 # 預留一些時間給 Flask 後端啟動

# --- 前端設定 ---
echo "正在啟動 React 前端..."
# 切換到 React 應用程式的目錄
cd "$PROJECT_ROOT/react-app"

# 啟動 React 開發伺服器。
# 此命令通常會佔用當前終端機並顯示日誌。
# 要停止所有服務：首先在此終端機中按 Ctrl+C 停止 React 應用程式，
# 然後手動終止 Flask 程序 (例如：'kill $FLASK_PID')。
npm start

# 腳本只有在 'npm start' 退出 (例如，按 Ctrl+C) 時才會執行到這裡。
echo "React 前端程序已停止。"
echo "請記住手動停止 Flask 後端 (PID: $FLASK_PID)，如果它仍在運行。"
echo "您可以使用 'kill $FLASK_PID' 來終止它。"
