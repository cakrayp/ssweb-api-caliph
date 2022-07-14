console.log('Starting...')
const { spawn } = require('child_process')
const path = require('path')

// from: https://github.com/NzrlAfndi/Ichigo-Kurosaki
// When your scriopt is crached, it will automatically all program restart...
function start() {
	const args = [path.join(__dirname, '/server.js'), ...process.argv.slice(2)]
	console.log([process.argv[0], ...args].join('\n'))
	const p = spawn(process.argv[0], args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })
	.on('message', (data) => {
		if (data == 'reset') {
			console.log('Restarting Bot...')
			p.kill()
			start()
			delete p
		}
	})
	.on('exit', (code) => {
		console.error('Exited with code:', code)
		if (code == 1) start();
	})
}
start();
