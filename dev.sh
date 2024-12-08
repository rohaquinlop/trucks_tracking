function main() {
    run_api & run_frontend
}

function run_api {
    uv venv --python 3.11
    uv sync
    source ./.venv/bin/activate
    fastapi dev main.py --port 8000
}

function run_frontend {
    pushd ./frontend
    yarn install
    yarn start
}

main "$@"