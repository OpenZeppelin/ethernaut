#!/usr/bin/env bash
# Public keys (corresponding to the private keys below):
# 0: 0xdf08f82de32b8d460adbe8d72043e3a7e25a3b39
# 1: 0x6704fbfcd5ef766b287262fa2281c105d57246a6

echo "starting testrpc..."

# Stop testrpc if it's running (assumes it was started by this script).
filePath=scripts/testrpc_pid
testrpc_running() {
  nc -z localhost 8545
}
if testrpc_running; then
  echo "test rpc is running, stopping it..."
  read pid < $filePath
  kill -9 $pid
fi

#-a or --accounts: Specify the number of accounts to generate at startup.
#-b or --blocktime: Specify blocktime in seconds for automatic mining. Default is 0 and no auto-mining.
#-d or --deterministic: Generate deterministic addresses based on a pre-defined mnemonic.
#-n or --secure: Lock available accounts by default (good for third party transaction signing)
#-m or --mnemonic: Use a specific HD wallet mnemonic to generate initial addresses.
#-p or --port: Port number to listen on. Defaults to 8545.
#-h or --hostname: Hostname to listen on. Defaults to Node's server.listen() default.
#-s or --seed: Use arbitrary data to generate the HD wallet mnemonic to be used.
#-g or --gasPrice: Use a custom Gas Price (defaults to 20000000000)
#-l or --gasLimit: Use a custom Gas Limit (defaults to 0x47E7C4)
#-f or --fork: Fork from another currently running Ethereum client at a given block. Input should be the HTTP location and port of the other client, e.g. http://localhost:8545. You can optionally specify the block to fork from using an @ sign: http://localhost:8545@1599200.
#-i or --network-id: Specify the network id the TestRPC will use to identify itself (defaults to the current time or the network id of the forked blockchain if configured)
#--db: Specify a path to a directory to save the chain database. If a database already exists, the TestRPC will initialize that chain instead of creating a new one.
#--debug: Output VM opcodes for debugging
#--mem: Output TestRPC memory usage statistics. This replaces normal output.

# Start new customized testrpc.
echo "starting testrpc..."
testrpc \
    -b 0 \
    -g 20000000000 \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501200,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501201,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501202,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501203,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501204,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501205,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501206,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501207,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501208,1000000000000000000000000"  \
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501209,1000000000000000000000000"  \
    & pid=$!
echo 'testrpc pid: '$pid

# Store process id for later reference.
if [[ ! -f $filePath ]]; then
  touch $filePath
fi
echo $pid > $filePath