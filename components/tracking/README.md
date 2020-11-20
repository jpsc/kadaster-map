# Tracking

Tracking is used to send client side event to [Segment platform](https://segment.com/).

## Events

All the events that we have are listed in `./events.js`. Each event has `key` and `props`.\
`key` is the event name, and `props` are the required properties that need to be sent along with the event. It's possible that some events don't have required properties.

Besides the required properties, every event also needs to include the global properties.
Global properties is listed as JSON which is available in the DOM and it can differ depending on the page context.
Therefore the global and required properties are eventually be merged and sent along with the event

**Important!**\
Any new event that is being tracked, **MUST BE** listed here, so that we have everything in one place and we know what are the events that we currently track.

## Enum props

Some properties have enum type that can be looked up [here](https://intranet.funda.nl/display/proj/Property+Enums)
**TODO**: validate these enum properties to only allow enum value
