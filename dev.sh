function main() {
    run_api & run_frontend
}

function run_api {
    pushd ./api
    source ./.venv/bin/activate
    fastapi dev main.py
}

function run_frontend {
    pushd ./frontend
    yarn start
}

main "$@"