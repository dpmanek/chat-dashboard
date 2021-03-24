var dialogflow = {
  "'TeaBot'": {
    privatekey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCgj8c476k6qXqb\nmsgish+CLu8vWiVqIU66VBKnmsyjdO6rKTveLb0nYw8zqIcvsH8lTxNxAaptzg21\n4tL49bAzNzsy378avm8OELW4V3gIa+SmMd9x8X+sug3DjFKettSdM6dIwMIic0Iu\nm9yFX//bTxdFiiFBD5x7gamRft+/tXBoEMs5T/0zp3bJuINLmk7joTQRjYFm22C3\nojBHD3jcOW+B1M5CLgOww/cl8/HxUD9I+H5iJ99FjmlzzPJmALTn0sxJX/mpVhfV\ny1jhxRBwfm0l4fiBlXJEeca8NhiCTrnKGT02PYDVKOSGW+GaX18BGUhuEKXtckgX\nXJ3b0mhTAgMBAAECggEAEw7d49k2qhrhzcSCivO/n7E4fNNja4SGlsFR8YkDT0ea\n6MAdNhMRx7IPZN9VJIj7no8TTK+Y7i2uHO/OgPSQtJOSuEgso90Ey5OaLkZbngxI\neJ2k2x6CPBtddN+cEvC6reoqqg0PPg2WRngDpeUuNnbd2Ug7CED1HwfV+8omfte3\nLcP94Fg+O27JB8Vsfb8VH47CfEKKH3nJP2QOtE+TNbmkDoyi126z53Ds4NVedHKo\nDFGaBzoMYf6msnzkLlDVsuFYkoBSW6rDIczqA3bTXkYx7R+EVTooFRRItVFJcRrO\n2mV7XI+fJwCX6Yipwo82OinW3cMm+Ex7x/LkJp1OkQKBgQDdbkJnx5EVUxn9OBho\nhmD6U9vZC/Me5hSazRQbNRha35Uk8eWecO51300SxQHy3JKnkmH3nmgiIUUIb+Sn\n+SHOU2VXnXJYNhlv9jRs8IQ7xP0yRhErBN3VDw/KY80/nzmCQWCW08qB9z6D80U6\n5ny0kE2Qf2PTcqQw2UhObdNguQKBgQC5oNB5OBXEUCWZNYff9MqpSBDY/1EM+MQd\n1/OJuIrDYNJv3/q5mwdu0CdXG5kALEzDjIqq7/nvXBEECt1gNEym8WTzRyn9mJW2\n5PPDrp4Zxpp29LLGSdtHAw0OsFfGelucZM5xmNDLxXjxPSTTSYYqUCXSmhCtYFTJ\nANikjIVTawKBgFG19ltFkYxE9jozEQ7BR9gYSfB2MGkejkvxkZHYrfwatXbErO8i\nzVxB4rcia+2q55NeuTgfBF5T2J2cbMxvasIwlB0YxLE4hXqDaCUrPCCyOJzsrjkp\nupJ81F7jJUJtB1PBvFrsHLaI/lDC3LE3jJ01Aupnl/bXPy+nfr8yV+ZBAoGAAPF1\nPbhwO+AgYMfp2dR3lyabl06szcER1gj73s5GPjnmt9TOhFTqU8DRAltMiriu5yt2\npOm1PmccWwXnHA8H+K0vUyEgcH5u/E/rgSoI+Z6NuF8D7YgAijrUvSdeOs7yWjgU\n6HTbUr29IJSr9DriaKKhnpFT1l2v8JmFgEiKgOMCgYBwD5lh3cNu2UoQPpHjoneF\ntpBHLOhOEjg6TFhwE+HCrYilVBOgBHCwE9hINCPqwdV713PyQ7GaU+EoSfyNuZtP\n7ra7ckY8Aq8NpuCmGx/V6MzpPTeejYaWbaJJCxETd+6z68ABR19TYqv3FClbnfyh\nR84D9tSh6P/utTvco6ErUA==\n-----END PRIVATE KEY-----\n",
    clientemail: "cafe-test-oevjtf@appspot.gserviceaccount.com",
  },
  /*  entitycolours: [
    "#66ffff",
    "#ffff66",
    "#ff00ff",
    "#66ff66",
    "#ff1a66",
    "#ff751a",
    "#3385ff",
    "#ff3333",
    "#FFFB00",
    "#da557d",
    "#4466e2",
    "#00ff99",
    "#ff9966",
    "#A1B0E5",
    "#d8d8d8",
    "#00ccff",
  ], */
};

/*var config = {
  development: {
    instance: "'TeaBot'",
    database: "dash",
    privatekey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCgj8c476k6qXqb\nmsgish+CLu8vWiVqIU66VBKnmsyjdO6rKTveLb0nYw8zqIcvsH8lTxNxAaptzg21\n4tL49bAzNzsy378avm8OELW4V3gIa+SmMd9x8X+sug3DjFKettSdM6dIwMIic0Iu\nm9yFX//bTxdFiiFBD5x7gamRft+/tXBoEMs5T/0zp3bJuINLmk7joTQRjYFm22C3\nojBHD3jcOW+B1M5CLgOww/cl8/HxUD9I+H5iJ99FjmlzzPJmALTn0sxJX/mpVhfV\ny1jhxRBwfm0l4fiBlXJEeca8NhiCTrnKGT02PYDVKOSGW+GaX18BGUhuEKXtckgX\nXJ3b0mhTAgMBAAECggEAEw7d49k2qhrhzcSCivO/n7E4fNNja4SGlsFR8YkDT0ea\n6MAdNhMRx7IPZN9VJIj7no8TTK+Y7i2uHO/OgPSQtJOSuEgso90Ey5OaLkZbngxI\neJ2k2x6CPBtddN+cEvC6reoqqg0PPg2WRngDpeUuNnbd2Ug7CED1HwfV+8omfte3\nLcP94Fg+O27JB8Vsfb8VH47CfEKKH3nJP2QOtE+TNbmkDoyi126z53Ds4NVedHKo\nDFGaBzoMYf6msnzkLlDVsuFYkoBSW6rDIczqA3bTXkYx7R+EVTooFRRItVFJcRrO\n2mV7XI+fJwCX6Yipwo82OinW3cMm+Ex7x/LkJp1OkQKBgQDdbkJnx5EVUxn9OBho\nhmD6U9vZC/Me5hSazRQbNRha35Uk8eWecO51300SxQHy3JKnkmH3nmgiIUUIb+Sn\n+SHOU2VXnXJYNhlv9jRs8IQ7xP0yRhErBN3VDw/KY80/nzmCQWCW08qB9z6D80U6\n5ny0kE2Qf2PTcqQw2UhObdNguQKBgQC5oNB5OBXEUCWZNYff9MqpSBDY/1EM+MQd\n1/OJuIrDYNJv3/q5mwdu0CdXG5kALEzDjIqq7/nvXBEECt1gNEym8WTzRyn9mJW2\n5PPDrp4Zxpp29LLGSdtHAw0OsFfGelucZM5xmNDLxXjxPSTTSYYqUCXSmhCtYFTJ\nANikjIVTawKBgFG19ltFkYxE9jozEQ7BR9gYSfB2MGkejkvxkZHYrfwatXbErO8i\nzVxB4rcia+2q55NeuTgfBF5T2J2cbMxvasIwlB0YxLE4hXqDaCUrPCCyOJzsrjkp\nupJ81F7jJUJtB1PBvFrsHLaI/lDC3LE3jJ01Aupnl/bXPy+nfr8yV+ZBAoGAAPF1\nPbhwO+AgYMfp2dR3lyabl06szcER1gj73s5GPjnmt9TOhFTqU8DRAltMiriu5yt2\npOm1PmccWwXnHA8H+K0vUyEgcH5u/E/rgSoI+Z6NuF8D7YgAijrUvSdeOs7yWjgU\n6HTbUr29IJSr9DriaKKhnpFT1l2v8JmFgEiKgOMCgYBwD5lh3cNu2UoQPpHjoneF\ntpBHLOhOEjg6TFhwE+HCrYilVBOgBHCwE9hINCPqwdV713PyQ7GaU+EoSfyNuZtP\n7ra7ckY8Aq8NpuCmGx/V6MzpPTeejYaWbaJJCxETd+6z68ABR19TYqv3FClbnfyh\nR84D9tSh6P/utTvco6ErUA==\n-----END PRIVATE KEY-----\n",
    clientemail: "cafe-test-oevjtf@appspot.gserviceaccount.com",
    entitycolours: [
      "#66ffff",
      "#ffff66",
      "#ff00ff",
      "#66ff66",
      "#ff1a66",
      "#ff751a",
      "#3385ff",
      "#ff3333",
      "#FFFB00",
      "#da557d",
      "#4466e2",
      "#00ff99",
      "#ff9966",
      "#A1B0E5",
      "#d8d8d8",
      "#00ccff",
    ],
  },
};*/

module.exports = dialogflow;
