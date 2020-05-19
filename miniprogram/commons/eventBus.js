const { once, createUid } = require('./utils')
class eventBus {
  constructor() {
    this.events = this.events || []
  }
  $on(name, execute, ctx) {
    return this.addEvent(name, execute, ctx)
  }
  $once(name, execute, ctx) {
    return this.addEvent(name, once(execute), ctx)
  }
  $off(name, eventId) {
    const events = this.events
    const index = events.findIndex(event => event.name === name)
    if (index === -1) {
      return this
    }
    if (!eventId) {
      events.splice(index, 1)
      return this
    }
    const executeIndex = events[index].executes.findIndex(item => item.id === eventId)
    if (executeIndex !== -1) {
      events[index].executes.splice(executeIndex, 1)
    }
    return this
  }
  $emit(name, ...args) {
    const event = this.$find(name)
    if (!event) {
      return this
    }
    const funcs = event.executes
    funcs.forEach(func => {
      if (func.ctx) {
        return func.execute.apply(func.ctx, args)
      }
      func.execute(...args)
    })
    return this
  }
  $find(name) {
    const events = this.events
    for (let i = 0; i < events.length; i++) {
      if (name === events[i].name) {
        return events[i]
      }
    }
    return null
  }
  $clear() {
    this.events.length = 0
    return this
  }
  addEvent(name, execute, ctx) {
    const eventId = createUid()
    const events = this.events
    const event = this.$find(name)

    if (event !== null) {
      event.executes.push({ id: eventId, execute, ctx })
      return eventId
    }
    events.push({
      name,
      executes: [
        {
          id: eventId,
          execute,
          ctx
        }
      ]
    })
    return eventId
  }
}

module.exports = eventBus