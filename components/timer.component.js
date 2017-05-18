(function() {
  angular
    .module('app', )
    .component('pomodoro', {
      controller: controller,
      templateUrl: './components/timer.html'
    })

  controller.$inject = ['$interval', '$timeout']

  function controller($interval, $timeout) {
    const vm = this
    vm.breakLength = 5
    vm.sessionLength = 0.05
    vm.changeBreak = changeBreak
    vm.changeSession = changeSession
    vm.toggleTimer = toggleTimer
    vm.timeTitle = 'work time'

    let runTimer = false
    let secs = 60 * vm.sessionLength
    let bellSound = new Audio('')
    vm.state = 'START'
    vm.timeLeft = secondsToHms(secs)

    function changeBreak(n) {
      if (n > 0 && vm.breakLength < 60) {
        vm.breakLength += 1
      } else if (n < 0 && vm.breakLength > 0) {
        vm.breakLength -= 1
      }
    }

    function changeSession(n) {
      if (n > 0 && vm.sessionLength < 60) {
        vm.sessionLength += 1
        secs = vm.sessionLength * 60
        vm.timeLeft = secondsToHms(secs)
      } else if (n < 0 && vm.sessionLength > 1) {
        vm.sessionLength -= 1
        secs = vm.sessionLength * 60
        vm.timeLeft = secondsToHms(secs)
      }
    }

    function secondsToHms(d) {
      d = Number(d)
      let hours = Math.floor(d / 3600)
      let min = Math.floor(d % 3600 / 60)
      let sec = Math.floor(d % 3600 % 60)
      return (
        (hours > 0 ? hours + ':' + (min < 10 ? '0' : '') : '') + min + ':' + (sec < 10 ? '0' : '') + sec
      )
    }

    function toggleTimer() {
      vm.state === 'START' ? vm.state = 'PAUSE' : vm.state = 'START'
      if (secs === 0) {
        timesUp()
      }

      if (vm.state === 'PAUSE' && secs > 0) {
        startTimer()
      } else {
        $interval.cancel(runTimer)
        runTimer = false
      }
    }

    function timesUp() {
      pauseSound()
      vm.timeTitle = 'BREAK TIME'
      secs = vm.breakLength * 60
      vm.timeLeft = secondsToHms(secs)
      vm.state = 'PAUSE'
      $interval.cancel(runTimer)
      runTimer = false
    }

    function startTimer() {
      runTimer = $interval(function() {
        if (secs > 0 && vm.state === 'PAUSE') {
          secs--
          vm.timeLeft = secondsToHms(secs)
        } else if (secs === 0 && vm.state === 'PAUSE') {
          vm.timeTitle = 'TIME\'S UP!'
          playSound()
        }
      }, 1000)
    }

    function playSound() {
        bellSound = new Audio('bell.mp3')
        bellSound.play()
    }

    function pauseSound() {
      bellSound.pause()
      bellSound.currentTime = 0
      console.log(bellSound.currentTime, bellSound, bellSound.paused)
    }

  }
}())
