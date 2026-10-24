<template>
  <section id="home" class="hero">

    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title fade-in-up">
            <span class="hello-line">HELLO, I'M</span>
            <span class="calligraphy-line">
              <!-- 轨迹取自 public/assets/余.svg（书法笔画折线，JS 驱动描边绘制） -->
              <svg ref="yuSvg" class="yu animated-svg" viewBox="0 0 121 110">
                <g transform="scale(0.171,0.171) translate(63,63)">
                  <path d="M 292.5 12.2 L 288.45 5.1 L 281.35 1.55 L 278.4 0.5 L 275.85 0 L 269.75 0 L 264.7 1 L 254 5.6 L 244.35 12.7 L 240.3 16.75 L 239.3 24.9 L 237.75 31 L 236.75 33 L 234.2 41.05 L 221.5 63.9 L 221 65.4 L 220 66.95 L 216.45 70.5 L 215.4 72 L 215.4 74.05 L 215.95 76.6 L 213.9 77.6 L 212.45 79.15 L 207.4 86.75 L 205.85 88.25 L 204.35 90.3 L 203.85 93.35 L 202.8 95.9 L 195.7 108.6 L 195.2 111.1 L 192.15 113.65 L 189.6 116.7 L 187.6 120.25 L 180.5 137.55 L 166.75 156.85 L 163.2 162.9 L 162.7 165.35 L 159.65 171.95 L 147.45 187.2 L 145.05 191.25 L 144 193.8 L 143.5 196.35 L 141.5 197.35 L 139.95 199.4 L 138.95 201.4 L 136.9 208 L 135.9 209.55 L 132.85 212.6 L 131.3 214.6 L 127.75 222.25 L 126.75 223.75 L 125.25 225.3 L 123.2 229.85 L 106.95 254.25 L 105.4 258.8 L 97.8 265.4 L 79.1 291.8 L 75.55 294.35 L 73 297.3 L 67.95 307.95 L 63.35 314.55 L 58.3 318.6 L 56.75 320.65 L 52.7 327.75 L 51.2 329.8 L 49.15 331.85 L 46.6 333.35 L 46.1 334.35 L 46.1 338.45 L 45.6 339.45 L 44.6 340.45 L 43.55 342 L 36.45 348.6 L 35.45 350.1 L 34.95 352.15 L 33.9 354.15 L 31.9 355.7 L 24.8 362.8 L 22.75 366.85 L 20.2 367.35 L 17.65 368.4 L 16.15 369.9 L 14.1 371.45 L 8.65 380.6 L 8.1 384.65 L 5.05 396.85 L 2.05 403.45 L 1 406.5 L 0 414.1 L 0.5 417.65 L 1.5 421.2 L 3.05 424.75 L 6.6 425.25 L 10.15 425.25 L 13.2 424.25 L 14.6 423.25 L 15.65 422.2 L 19.2 417.65 L 46.6 387.7 L 48.65 382.1 L 54.25 372.95 L 72 352.15 L 72 349.1 L 73 346.55 L 75.05 344.5 L 77.1 343 L 81.05 338.95 L 82.55 336.9 L 83.6 334.35 L 89.7 329.3 L 94.75 323.2 L 116.6 290.8 L 121.65 285.2 L 124.2 280.15 L 139.95 257.3 L 144.5 247.1 L 149 242.05 L 153.05 233.4 L 157.1 228.35 L 160.65 226.3 L 161.7 222.75 L 163.2 219.7 L 171.35 208.5 L 173.35 201.9 L 175.9 199.9 L 179.95 194.3 L 184.05 184.65 L 188.1 179.05 L 190.65 176.55 L 192.15 174 L 198.75 158.35 L 200.8 156.3 L 200.8 154.3 L 200.3 152.75 L 200.3 150.2 L 200.8 149.2 L 201.8 148.7 L 202.8 148.7 L 204.35 149.2 L 204.85 148.2 L 205.85 146.65 L 207.9 145.15 L 208.9 144.15 L 209.45 142.6 L 209.45 141.6 L 208.9 140.05 L 210.45 136.5 L 212.45 133.95 L 221.5 120.75 L 236.25 95.9 L 241.3 89.3 L 252 68.95 L 253 65.9 L 283.85 32.5 L 293 20.3 L 293.5 17.8 L 293.5 15.75 L 292.5 12.2"></path>
                  <path d="M 522.25 147.7 L 518.2 145.65 L 509.05 142.6 L 499.4 142.1 L 487.2 135.5 L 452.8 126.35 L 446.2 123.8 L 435.5 121.3 L 414.7 114.15 L 388.4 108.05 L 371.1 106.55 L 367.55 104 L 365.55 103 L 363.5 103 L 359.95 100.95 L 355.9 99.45 L 340.75 97.9 L 337.2 96.9 L 333.65 94.85 L 328.55 93.85 L 318.9 93.85 L 316.9 92.85 L 314.85 91.3 L 310.8 91.3 L 301.65 94.35 L 297.6 94.85 L 307.75 102.5 L 323 111.65 L 340.25 118.25 L 343.8 121.3 L 351.8 125.85 L 355.9 127.35 L 369.1 130.95 L 373.65 132.95 L 377.2 136.5 L 391.45 143.1 L 406.15 148.7 L 415.7 154.3 L 428.9 159.85 L 436 161.9 L 439.6 164.45 L 456.85 174 L 476.65 182.1 L 479.1 183.65 L 480.6 185.15 L 483.65 189.75 L 484.65 192.25 L 485.2 195.3 L 482.15 196.35 L 478.7 196.35 L 477.15 196.85 L 475.65 197.85 L 475.1 199.4 L 475.1 201.9 L 486.2 205.5 L 506 217.15 L 515.15 223.75 L 517.7 224.25 L 519.2 224.75 L 521.25 227.8 L 521.75 229.85 L 523.25 231.4 L 524.8 231.9 L 526.8 231.9 L 534.45 237.45 L 543.05 241.55 L 547.55 242.55 L 556.7 242.05 L 561.25 240 L 561.75 237.45 L 562.8 234.95 L 566.35 230.85 L 567.35 228.85 L 568.85 226.8 L 568.85 224.25 L 568.35 221.75 L 571.9 198.85 L 574.95 191.75 L 572.45 185.15 L 568.85 179.05 L 554.15 163.45 L 535.95 150.2 L 531.4 150.2 L 522.25 147.7"></path>
                  <path d="M 329.6 238.5 L 326 235.45 L 319.95 230.85 L 317.9 228.85 L 316.4 226.3 L 315.35 220.2 L 318.4 200.4 L 318.4 194.3 L 317.4 191.25 L 315.85 188.2 L 313.85 186.2 L 312.8 183.65 L 311.3 181.6 L 309.75 180.1 L 307.75 179.05 L 304.2 178.05 L 300.1 177.55 L 286.9 177.55 L 282.85 176.55 L 280.3 175.5 L 278.4 174 L 276.35 173 L 275.35 173 L 273.3 173.5 L 270.25 178.05 L 267.7 183.65 L 267.2 187.7 L 267.2 192.25 L 270.75 209.05 L 271.3 218.15 L 273.3 221.75 L 273.3 224.25 L 272.3 225.3 L 261.1 222.75 L 250.95 216.65 L 233.2 200.9 L 235.2 215.65 L 237.25 223.25 L 240.3 229.85 L 243.85 231.9 L 267.7 252.7 L 268.75 256.25 L 269.25 259.8 L 268.25 266.4 L 264.15 279.1 L 266.2 280.65 L 267.2 281.65 L 268.25 284.7 L 267.7 287.25 L 264.7 297.8 L 264.7 299.3 L 265.7 302.9 L 266.7 304.4 L 266.7 306.95 L 265.7 308.45 L 264.15 309.5 L 262.15 310 L 260.1 311 L 258.6 311.5 L 257.05 313.05 L 256.05 315.05 L 250.45 312.55 L 247.4 312.55 L 235.2 315.05 L 232.2 315.05 L 231.15 313.55 L 231.15 312.55 L 231.65 311 L 232.7 310 L 234.7 307.45 L 235.75 304.4 L 221 314.55 L 216.45 319.65 L 214.9 323.2 L 215.95 332.35 L 215.95 342.5 L 214.9 346.05 L 214.4 349.6 L 214.4 353.15 L 214.9 356.2 L 219.5 367.9 L 219.5 369.9 L 220 371.45 L 220.5 372.45 L 221.5 373.45 L 223.55 375 L 231.65 377 L 233.7 378.55 L 235.75 380.6 L 240.8 381.6 L 243.35 381.1 L 249.95 379.05 L 254 377 L 258.6 377 L 260.6 378.55 L 261.65 379.55 L 262.15 380.6 L 263.15 381.6 L 262.15 383.65 L 262.15 385.15 L 262.65 388.7 L 262.65 392.25 L 258.6 404.95 L 258.1 408.5 L 258.6 412.05 L 258.6 413.1 L 256.55 416.65 L 255.55 417.65 L 255.55 419.7 L 256.05 421.2 L 253.5 434.8 L 251.45 439.4 L 246.9 440.9 L 231.65 442.95 L 206.9 441.4 L 202.8 439.9 L 198.75 437.35 L 195.7 434.8 L 189.6 427.7 L 185.05 419.7 L 184.05 414.1 L 175.4 397.85 L 162.2 380.6 L 156.1 376 L 152.05 374 L 149.5 374 L 148 374.5 L 146.95 375 L 146.05 382.1 L 146.95 406.5 L 149.5 417.65 L 149 420.2 L 148 422.2 L 146.45 430.75 L 147.45 438.9 L 149.5 447 L 149 455.65 L 151.55 458.7 L 153.05 461.75 L 161.2 482.05 L 166.75 494.25 L 171.85 499.3 L 174.4 501.35 L 181 503.9 L 184.05 503.9 L 186.55 502.85 L 191.15 499.8 L 195.7 497.8 L 198.75 498.3 L 202.8 497.8 L 205.85 496.25 L 208.4 494.25 L 210.45 491.2 L 208.4 476.95 L 206.4 471.4 L 204.35 468.35 L 204.35 465.8 L 200.8 457.65 L 199.8 452.6 L 199.8 450.05 L 200.8 447.5 L 202.3 447 L 203.85 447 L 205.85 448 L 210.45 451.05 L 214.9 458.2 L 226.1 470.35 L 230.65 477.45 L 233.2 478.5 L 235.75 480 L 239.8 483.55 L 246.4 492.7 L 253.5 501.35 L 258.1 504.9 L 260.6 506.4 L 263.15 507.45 L 263.65 506.95 L 264.7 507.95 L 265.2 508.95 L 266.7 509.95 L 267.7 511 L 268.75 511.5 L 270.25 512 L 271.8 512 L 278.4 511 L 278.9 508.95 L 279.8 507.45 L 280.85 506.4 L 282.35 505.9 L 285.9 505.9 L 289.45 506.4 L 301.65 490.7 L 303.7 485.6 L 305.2 483.55 L 306.2 481.05 L 308.25 465.8 L 308.25 460.2 L 306.75 451.55 L 306.75 448.55 L 307.25 446 L 308.25 442.95 L 306.75 437.35 L 304.7 395.8 L 305.7 387.2 L 305.2 374 L 306.75 370.4 L 308.75 367.35 L 310.3 365.85 L 312.8 364.35 L 316.4 363.8 L 324 363.8 L 327.55 364.35 L 335.65 361.8 L 344.3 358.75 L 351.3 354.15 L 354.35 350.6 L 356.4 346.05 L 357.9 338.45 L 354.35 322.2 L 353.85 314.05 L 349.8 304.9 L 349.3 303.4 L 348.8 299.85 L 348.25 298.3 L 347.75 297.3 L 346.25 297.3 L 343.8 297.8 L 341.75 296.3 L 334.65 294.85 L 319.4 296.3 L 314.35 296.3 L 312.3 295.25 L 309.75 294.35 L 307.75 292.8 L 305.7 290.8 L 306.2 278.1 L 305.7 264.4 L 308.75 259.8 L 310.8 258.3 L 313.85 257.3 L 315.85 255.75 L 318.4 254.75 L 328.05 249.65 L 330.6 247.65 L 332.1 246.1 L 332.1 243.55 L 331.6 241.55 L 329.6 238.5"></path>
                  <path d="M 338.7 395.3 L 334.65 394.8 L 338.7 400.9 L 350.3 416.15 L 351.8 419.7 L 356.4 423.75 L 358.4 428.7 L 358.95 440.4 L 352.85 449.55 L 344.3 456.15 L 334.15 461.75 L 324 465.8 L 324 468.35 L 328.55 470.35 L 331.1 470.35 L 332.65 469.85 L 333.65 469.35 L 333.15 470.85 L 333.15 472.4 L 334.15 474.95 L 336.2 477.45 L 338.2 479 L 347.25 484.05 L 349.3 485.6 L 356.4 487.65 L 378.25 495.75 L 393.95 496.25 L 396.5 495.75 L 399.05 494.75 L 402.1 495.25 L 405.65 495.25 L 411.25 493.2 L 421.8 486.6 L 422.3 484.6 L 422.3 483.05 L 421.8 482.05 L 423.35 479 L 423.35 476.95 L 422.8 474.45 L 421.8 471.9 L 418.75 466.8 L 418.25 463.75 L 418.75 460.2 L 418.25 458.2 L 417.25 456.15 L 410.2 448.55 L 408.2 443.95 L 397.55 434.3 L 362 408.5 L 354.85 405.45 L 345.85 398.85 L 338.7 395.3"></path>
                </g>
              </svg>
              <!-- 轨迹取自 public/assets/诺.svg -->
              <svg ref="nuoSvg" class="nuo animated-svg" viewBox="0 0 94 110">
                <g transform="scale(0.171,0.171) translate(63,63)">
                  <path d="M 331.05 4.45 L 326.65 2.6 L 307.05 0 L 300 3 L 291.5 9.65 L 285.95 12.6 L 284.1 12.95 L 282.6 12.95 L 277.45 18.15 L 279.65 17.75 L 281.5 17.05 L 293.7 10.75 L 298.15 8.9 L 302.6 8.15 L 304.8 8.15 L 309.6 9.25 L 312.2 10.4 L 313.7 15.95 L 314.45 21.85 L 313.3 34.35 L 311.45 40.65 L 307.05 49.5 L 305.2 52.1 L 300.75 56.9 L 298.15 67.25 L 292.25 81.7 L 284.45 94.55 L 272.65 110.1 L 260.8 123.8 L 260.05 128.2 L 258.6 132.3 L 256.35 135.6 L 253.75 138.6 L 240.1 149.6 L 248.95 145.15 L 257.45 140.05 L 265.6 134.15 L 273.35 127.5 L 287.45 113.05 L 300 96.4 L 316.3 68.75 L 329.6 38.8 L 336.6 18.15 L 337 14.8 L 336.6 11.85 L 335.9 9.65 L 334.75 7.4 L 331.05 4.45"></path>
                  <path d="M 94.7 11.1 L 89.15 10.4 L 87.3 10.75 L 82.15 10.75 L 74.75 10 L 71.4 10 L 69.95 10.4 L 68.45 11.1 L 66.95 12.25 L 65.85 13.7 L 64.4 18.15 L 66.95 18.9 L 68.45 20.75 L 68.8 19.6 L 68.8 15.2 L 69.2 14.45 L 69.95 13.7 L 72.15 12.25 L 73.25 12.25 L 74.35 11.85 L 77.7 12.95 L 79.55 14.45 L 82.9 17.75 L 85.1 20.75 L 91.4 25.1 L 96.2 30.3 L 99.5 35.45 L 100.65 38.05 L 102.1 46.55 L 102.1 52.45 L 99.15 64.3 L 94.35 76.15 L 84 97.9 L 81.4 107.15 L 87.7 97.9 L 94.7 93.1 L 100.65 87.15 L 109.15 71.35 L 112.1 62.45 L 118.75 34.7 L 114.3 25.1 L 111.35 21.1 L 104.35 14.8 L 99.9 12.6 L 94.7 11.1"></path>
                  <path d="M 254.9 41 L 250.45 44.7 L 245.25 46.9 L 239.7 48.4 L 233.8 48.4 L 224.9 46.55 L 219.75 43.95 L 215.3 39.9 L 210.85 39.15 L 204.2 38.8 L 200.85 39.5 L 197.9 41 L 196.8 41.75 L 195.35 44.7 L 194.95 46.55 L 197.15 49.15 L 201.6 59.85 L 206.8 79.1 L 208.25 82.45 L 210.1 85.3 L 212.35 87.9 L 215.3 90.1 L 218.25 91.6 L 222.35 92.7 L 227.15 92.7 L 228.25 81.3 L 230.85 80.2 L 233.4 78.35 L 239.35 72.05 L 244.15 63.2 L 253.05 44.35 L 256.75 38.8 L 254.9 41"></path>
                  <path d="M 271.9 164.75 L 265.95 165.5 L 258.2 168.85 L 256.35 167 L 256.35 165.9 L 256.75 165.15 L 254.15 166.6 L 244.15 169.6 L 241.95 170.7 L 239.7 172.55 L 237.5 175.5 L 237.5 174.75 L 236.4 174.75 L 230.1 175.15 L 227.9 174.4 L 226.75 173.65 L 224.9 171.8 L 224.55 170.3 L 214.2 185.5 L 213.45 188.05 L 213.45 190.3 L 213.8 192.5 L 219.35 202.5 L 221.95 204.35 L 223.45 205 L 225.65 205 L 226.75 204.7 L 229.35 203.6 L 234.15 200.65 L 236.75 199.9 L 240.1 199.9 L 244.15 203.25 L 245.65 205 L 247.5 208.35 L 247.85 210.2 L 247.85 213.5 L 244.5 219.8 L 228.25 237.2 L 222.7 245.35 L 220.5 252 L 220.1 254.2 L 220.5 256.8 L 220.5 259 L 226.75 259.4 L 236.75 256.8 L 245.25 252.75 L 267.1 261.6 L 269.65 266.7 L 273.75 278.2 L 274.85 284.85 L 229 306.65 L 182 326.2 L 181.65 328.8 L 180.9 331 L 179.8 332.1 L 178.3 332.5 L 176.45 332.5 L 171.65 331.35 L 153.9 346.55 L 139.45 360.95 L 143.55 357.25 L 152.4 350.95 L 166.45 343.2 L 206.05 324.05 L 215.3 318.5 L 222.7 315.9 Q 234 310 245.25 304.05 L 256.35 300 L 263.75 298.9 L 271.15 300 L 274.85 301.5 L 270.8 318.1 L 268.2 326.2 L 261.55 341.7 L 248.95 364.3 L 229.7 392.3 L 210.1 418.95 L 207.55 420.45 L 189.4 436.7 L 184.25 440.4 L 178.3 443 L 171.65 443.35 L 155.75 437.8 L 148.7 433.4 L 142.45 427.85 L 137.25 421.15 L 132.8 414.15 L 129.5 406.4 L 125.05 389.35 L 122.85 392.7 L 121.35 396.75 L 120.6 405.65 L 121.35 424.15 L 121.7 427.1 L 125.05 434.85 L 132.05 443.75 L 136.5 447.75 L 150.95 457.7 L 151.7 459.2 L 153.55 461.8 L 154.65 462.55 L 157.6 464 L 160.95 464.75 L 168.7 465.5 L 176.85 465.5 L 188.3 457.35 L 204.95 442.65 L 231.95 412.65 L 241.95 400.1 L 261.9 377.6 L 263 383.15 L 267.8 399.7 L 268.95 405.25 L 269.3 413.4 L 268.2 418.95 L 267.1 421.55 L 254.5 461.05 L 252.65 475.1 L 252.65 478.8 L 254.15 489.15 L 257.85 498.8 L 261.9 505.05 L 264.5 507.95 L 273 509.8 L 279.65 510.15 L 281.15 509.8 L 282.6 509.05 L 283.75 508.3 L 284.85 507.3 L 285.95 505.8 L 286.3 503.95 L 304.45 510.15 L 315.15 512 L 317.75 512 L 322.95 511.3 L 330.7 509.05 L 352.25 506.55 L 357.05 505.05 L 364.45 501.75 L 366.65 500.25 L 362.95 494.7 L 361.5 491.75 L 357.4 486.55 L 356.3 485.85 L 354.8 485.1 L 351.5 484.35 L 349.2 484.35 L 347 484.7 L 352.6 479.15 L 362.6 467.35 L 366.65 460.3 L 367.75 461.4 L 372.2 457.35 L 392.9 444.1 L 399.2 438.2 L 401.45 435.25 L 403.3 431.9 L 404.4 426 L 404.4 424.15 L 404 421.9 L 401.45 414.9 L 397 410.1 L 387.75 403.05 L 377.75 399 L 367.4 397.5 L 361.85 397.5 L 339.6 401.2 L 317.4 407.5 L 315.55 408.25 L 313.7 409.7 L 304.8 419.7 L 300.35 423.4 L 298.5 424.5 L 296.65 424.85 L 292.6 424.85 L 290.4 424.15 L 290 422.65 L 290 418.95 L 290.4 417.5 L 291.15 416 L 292.25 414.9 L 293.7 414.15 L 295.55 413.8 L 295.2 410.1 L 293.7 403.4 L 292.25 400.45 L 288.55 395.3 L 284.1 390.85 L 278.9 386.8 L 261.9 376.5 L 263 373.15 L 268.2 362.8 L 277.8 349.5 L 286.7 334.7 L 289.65 326.95 L 291.5 318.5 L 290 306.65 L 290.4 302.95 L 291.85 297.4 L 294.8 292.25 L 300.75 286.7 L 308.5 282.6 L 314.8 280.4 L 353.7 270.8 L 364.05 265.6 L 365.9 270.05 L 367.05 274.5 L 367.05 278.2 L 366.3 281.85 L 365.2 285.2 L 361.5 291.5 L 358.9 294.45 L 344.4 308.5 L 341.8 311.45 L 339.6 314.8 L 338.1 318.5 L 338.85 318.5 L 339.95 318.85 L 343.3 322.2 L 347.7 322.95 L 352.25 322.95 L 356.65 322.2 L 365.2 319.6 L 372.6 315.55 L 375.55 313.3 L 392.55 302.6 L 403.65 292.95 L 416.95 278.55 L 416.6 277.45 L 416.6 275.6 L 417.7 274.5 L 418.45 274.1 L 418.8 274.1 L 419.55 274.5 L 420.3 271.15 L 420.3 268.95 L 419.9 268.2 L 417.7 265.95 L 414 264.55 L 412.15 263.45 L 410.3 261.6 L 414.35 252.75 L 397 249.05 L 388.85 247.9 L 373.3 248.65 L 365.55 250.5 L 357.8 253.45 L 349.55 257.9 L 347.7 260.5 L 346.25 261.25 L 344.75 262.35 L 334.05 265.95 L 331.05 267.45 L 329.2 269.3 L 328.85 270.8 L 328.85 271.9 L 326.65 269.65 L 326.25 268.2 L 325.15 268.2 L 323.7 268.55 L 312.95 274.85 L 306.65 277.45 L 302.2 278.2 L 300 277.8 L 297.8 277.05 L 295.55 275.95 L 295.95 274.85 L 295.95 273.75 L 295.55 271.9 L 295.55 270.05 L 295.95 268.95 L 296.65 268.2 L 294.1 262.35 L 292.25 259.75 L 290 257.55 L 273.75 245.35 L 268.95 240.9 L 266.7 238.3 L 263 232.75 L 261.9 229.4 L 263.4 226.45 L 265.25 223.9 L 265.95 222.4 L 266.35 221.3 L 266.35 220.2 L 265.6 217.95 L 265.6 216.85 L 265.95 216.1 L 266.7 215.35 L 268.2 214.25 L 269.65 212.8 L 270.8 212.8 L 273.35 215.35 L 281.5 204 L 285.95 195.1 L 287.8 189.9 L 290.4 179.2 L 285.6 169.95 L 282.25 167 L 277.45 165.5 L 271.9 164.75 M 312.2 426.7 L 316.65 424.85 L 319.25 424.15 L 321.85 423.75 L 326.65 424.5 L 330.35 427.85 L 324.4 461.8 L 319.6 478.05 L 317.75 481.75 L 313.3 488.4 L 311.1 491 L 286.3 495.1 L 285.6 475.85 L 287.45 461.05 L 290 451.8 L 294.45 443.35 L 300 435.6 L 303.7 432.25 L 312.2 426.7"></path>
                  <path d="M 78.45 196.6 L 71.05 198.45 L 68.45 197.3 L 60.3 195.1 L 41.45 194.35 L 28.5 195.85 L 26.65 194.35 L 25.9 193.6 L 25.9 192.15 L 23.35 192.5 L 21.1 192.5 L 17.4 191.75 L 5.55 182.9 L 4.1 182.15 L 2.6 182.15 L 0 182.9 L 18.15 198.45 L 49.6 208.7 L 66.25 212.8 L 76.95 213.15 L 82.15 212.4 L 84.75 211.65 L 89.55 209.45 L 96.2 204.7 L 100.65 199.9 L 97.3 197.7 L 94 196.6 L 90.3 195.85 L 86.2 195.85 L 78.45 196.6"></path>
                  <path d="M 46.25 238.3 L 45.15 240.9 L 46.25 242.35 L 45.15 244.95 L 51.05 263.45 L 54.05 275.95 L 54.4 282.6 L 52.9 292.95 L 51.45 296.3 L 51.05 303.7 L 51.45 310.75 L 53.3 324.4 L 61.8 358 L 63.25 371.3 L 62.55 381.3 L 61.8 385 L 59.6 391.95 L 56.25 399 L 51.45 406 L 51.05 409.35 L 42.55 431.9 L 41.1 474.35 L 47.35 478.8 L 55.5 482.15 L 69.95 485.45 L 74.75 485.85 L 74.35 483.6 L 74.35 482.15 L 75.1 480.65 L 76.2 479.55 L 77.35 478.8 L 81.4 476.95 L 98.05 421.55 L 126.15 305.55 L 132.8 266.7 L 134.65 240.9 L 134.3 215.35 L 126.9 248.65 L 108.75 303.7 L 100.65 325.5 L 74.75 389.35 L 72.15 387.9 L 73.65 382.8 L 74 372.8 L 72.9 362.8 L 63.65 332.85 L 61.05 318.85 L 61.8 309.25 L 64.75 304.45 L 67.35 294.8 L 67.7 290 L 67.35 285.55 L 65.1 276.7 L 61.45 268.2 L 49.95 247.2 L 46.25 238.3"></path>
                </g>
              </svg>
            </span>
          </h1>
          <div class="hero-actions fade-in-up" style="animation-delay: 0.4s">
            <a href="#projects" class="btn" @click.prevent="scrollToSection('#projects')">Show</a>
            <a href="#contact" class="btn btn-outline" @click.prevent="scrollToSection('#contact')">Contact</a>
          </div>
          
        </div>

        <div class="hero-visual">
          <div class="avatar-wrapper" @dragstart.prevent>
            <canvas ref="waveCanvas" class="wave-canvas"></canvas>
            <div class="avatar" ref="avatarElement">
              <img src="@/assets/images/user.webp" alt="个人头像" fetchpriority="high" draggable="false" />
            </div>
            <!-- 音量摆锤：珠串式胶囊嵌在头像圆内，两条线固定锚在圆框上下，左右拖动调音量，拖入两端磁吸底座关闭 -->
            <div ref="swingHost" class="swing-volume" :class="{ 'is-dragging': swingDragging, 'is-off': !isPlaying }">
              <svg class="swing-lines" viewBox="-320 -320 640 640" aria-hidden="true">
                <!-- 磁吸底座：圆框左右外侧的括号形卡槽（开口朝圆心），胶囊拖到尽头滑出圆缘嵌进去 -->
                <path ref="dockLRef" class="swing-dock" d=""></path>
                <path ref="dockRRef" class="swing-dock" d=""></path>
                <line ref="lineLRef" class="swing-line" x1="0" y1="0" x2="0" y2="0"></line>
                <line ref="lineRRef" class="swing-line" x1="0" y1="0" x2="0" y2="0"></line>
              </svg>
              <div
                ref="capsuleRef"
                class="swing-capsule"
                :class="{ 'is-latched': swingLatched !== 0 }"
                role="slider"
                aria-label="音乐摆锤：左右拖动调节音量，拖到两端关闭，轻点切换播放"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-valuenow="volumePct"
                @pointerdown="onCapsulePointerDown"
                @pointermove="onCapsulePointerMove"
                @pointerup="onCapsulePointerUp"
                @pointercancel="onCapsulePointerUp"
              >
                <svg v-if="!isPlaying" class="capsule-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg v-else class="capsule-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h12v12H6z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import backgroundMusic from '@/assets/audio/background-music.mp3'

const waveCanvas = ref(null)
const avatarElement = ref(null)
const yuSvg = ref(null)
const nuoSvg = ref(null)
const isPlaying = ref(false)

// ---------- 余诺书法描边动画 ----------
// 轨迹来自 public/assets/余.svg、诺.svg（笔画轮廓闭合环）：两个字同时开始绘制；
// 前 70% 进度描边勾勒轮廓，后 30% 进度 fill-opacity 由透明渐显为实心（填充）。
// 进度目标直接跟随滚动值（窄区间映射），渲染以 ~0.5s 时间常数平滑趋近——
// 下滚逆向（先褪实心再收笔）、上滚正向（先描边后填充）都是可感知的过渡过程。
const DRAW_DURATION = 2000
const SCROLL_RANGE = 0.6 // 滚过 0.6 个视口高度内：完整 → 消失（文字滚出视野前收完）
const FILL_START = 0.7 // 进度前 70% 描边、后 30% 填充实心
const SMOOTH_TAU = 0.5
let strokePaths = [] // [{ el, len }]
let drawStartT = 0
let drawRafId = 0
let displayP = 0
let lastFrameT = 0

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

function initCalligraphyStrokes() {
  const paths = [
    ...(yuSvg.value?.querySelectorAll('path') || []),
    ...(nuoSvg.value?.querySelectorAll('path') || []),
  ]
  strokePaths = paths.map((el) => {
    const len = el.getTotalLength()
    el.style.strokeDasharray = `${len}`
    el.style.strokeDashoffset = `${len}`
    return { el, len }
  })
}

function updateCalligraphy() {
  // 开场 3D 转场遮罩卸载后页面才真正可见，此刻起笔（保证「同时渲染」被看见；
  // 无转场路径（移动端等）遮罩从不出现，mounted 后即起笔）
  if (drawStartT === 0 && !document.querySelector('.cluster-intro')) {
    drawStartT = performance.now()
  }
  const introP =
    drawStartT === 0
      ? 0
      : easeOutCubic(clamp01((performance.now() - drawStartT) / DRAW_DURATION))
  const scrollP = 1 - clamp01(window.scrollY / (window.innerHeight * SCROLL_RANGE))
  const target = Math.min(introP, scrollP)

  // 指数平滑：目标即时跟随滚动值，过渡过程慢到能被感知
  const now = performance.now()
  const dt = Math.min(Math.max((now - lastFrameT) / 1000, 0), 0.05)
  lastFrameT = now
  displayP += (target - displayP) * (1 - Math.exp(-dt / SMOOTH_TAU))
  if (Math.abs(target - displayP) < 0.0005) displayP = target

  // 两段式：先描边勾轮廓，后填充渐显实心（fill-opacity）
  const drawP = clamp01(displayP / FILL_START)
  const fillP = clamp01((displayP - FILL_START) / (1 - FILL_START))
  for (const { el, len } of strokePaths) {
    el.style.strokeDashoffset = `${len * (1 - drawP)}`
    el.style.fillOpacity = `${fillP}`
  }
}

function calligraphyLoop() {
  updateCalligraphy()
  drawRafId = requestAnimationFrame(calligraphyLoop)
}
// ---------- 书法描边动画结束 ----------
let audioContext = null
let analyser = null
let source = null
let audioElement = null
let animationId = null
let dataArray = null
let avatarRadius = 175

const isDark = ref(false)

let fadeObserver = null
let themeObserver = null

const checkTheme = () => {
  const wasDark = isDark.value
  isDark.value = document.documentElement.classList.contains('dark')
  
  if (wasDark !== isDark.value) {
   
    if (waveCanvas.value) {
      const ctx = waveCanvas.value.getContext('2d')
      ctx.clearRect(0, 0, 600, 600)
    }
  }
}

onMounted(() => {
  checkTheme()
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  // 书法描边：mounted 同步置初始 offset（避免首帧闪现完整字形），再启动绘制循环；
  // 起笔时刻由 updateCalligraphy 检测遮罩卸载后决定
  initCalligraphyStrokes()
  calligraphyLoop()

  // 音量摆锤：按头像尺寸初始化几何，启动物理循环
  updateSwingGeometry()
  lastSwingT = performance.now()
  swingLoop()
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        obs.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })

  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el))
  fadeObserver = observer

  themeObserver = new MutationObserver(() => {
    checkTheme()
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

const toggleAudio = async () => {
  if (!audioContext) {
    await initAudio()
  }

  if (isPlaying.value) {
    pauseAudio()
  } else {
    await playAudio()
  }
}

// ---------- 音量摆锤：珠串式胶囊在头像圆内水平滑动 ----------
// 模型：阻尼水平弹簧振子（x 为偏离圆心的水平位移）。胶囊沿水平直径滑动，
// 两条线从胶囊上下端沿径向延伸到圆框（居中时共线成竖直直径，偏移时 V 形张开）。
// 拖拽时 x 跟随指针并即时映射音量 vol = 1 - |x|/xMax（居中最响，向两缘递减）；
// 松手超过阈值锁定到边缘并暂停，松手中途则带惯性来回摆动；轻点 = 播放/暂停切换；
// 从边缘拖回中间自动恢复播放。
const swingHost = ref(null)
const capsuleRef = ref(null)
const lineLRef = ref(null)
const lineRRef = ref(null)
const dockLRef = ref(null)
const dockRRef = ref(null)
const swingDragging = ref(false)
const swingLatched = ref(0) // -1=锁在左缘 0=未锁 1=锁在右缘
const volumePct = ref(100)

const SWING = {
  xOff: 0.85, // 松手超过 85% 行程判定为「拖入底座」→ 关闭
  halfLen: 27, // 胶囊半长（与 CSS 尺寸 54px 对应）
  tiltMax: 10, // 拉离中心时的最大倾角（度，被线拽向中心的姿态）
  dockIn: 8, // 底座卡臂探入圆内的深度（贴住圆缘）
  dockOut: 15, // 底座背板到圆缘外侧的距离
  dockY: 35, // 底座上下卡臂的半距（比胶囊半长略宽，留入座余量）
  w0: 5.2, // 固有角频率 → 摆动周期约 1.2s
  damp: 1.1, // 阻尼：摆两三个来回后稳住
}
let posX = 0 // 当前水平位移
let velX = 0 // 水平速度
let swingR = 165 // 头像半径
let swingXMax = 137 // 滑动半行程
let swingRafId = 0
let lastSwingT = 0
let grabDX = 0 // 按下时指针水平位置与胶囊位移的差值：相对拖拽基准
const velHist = [] // 最近 ~120ms 的位移轨迹，松手时估算拽动方向与惯性
let downX = 0
let downY = 0
let downT = 0
let dragMoved = false

function volumeFromX() {
  return clamp01(1 - Math.abs(posX) / swingXMax)
}

function applyVolume() {
  const v = volumeFromX()
  volumePct.value = Math.round(v * 100)
  capsuleRef.value?.style.setProperty('--vol', `${v}`)
  if (audioElement) audioElement.volume = v
  return v
}

function setLine(el, x1, y1, x2, y2) {
  el.setAttribute('x1', x1.toFixed(1))
  el.setAttribute('y1', y1.toFixed(1))
  el.setAttribute('x2', x2.toFixed(1))
  el.setAttribute('y2', y2.toFixed(1))
}

function renderSwing() {
  const cap = capsuleRef.value
  if (!cap) return
  // 接近底座时倾角逐臂归零（卡槽是刚性直槽，入座前竖直对齐）；
  // 中段则朝圆心微倾（被两条弹弓线拽着的感觉）
  const prox = Math.abs(posX) / swingXMax
  const near = clamp01((prox - 0.7) / 0.3)
  const tilt = -(posX / swingXMax) * SWING.tiltMax * (1 - near)
  cap.style.transform = `translate(${posX.toFixed(1)}px, 0px) rotate(${tilt.toFixed(1)}deg)`
  // 上下端点（含倾斜）
  const rad = (tilt * Math.PI) / 180
  const sinT = Math.sin(rad)
  const cosT = Math.cos(rad)
  const tx = posX - SWING.halfLen * sinT
  const ty = -SWING.halfLen * cosT
  const bx = posX + SWING.halfLen * sinT
  const by = SWING.halfLen * cosT
  // 弹弓式连线：锚点固定在圆框正上/正下（12/6 点钟），拖离中心时线被绷紧拉长，
  // 呈拉扯感（而非跟着胶囊滑到同侧），松手回弹的物理方向一目了然
  if (lineLRef.value) setLine(lineLRef.value, 0, -swingR, tx, ty)
  if (lineRRef.value) setLine(lineRRef.value, 0, swingR, bx, by)

  // 磁吸底座：越接近对应端越亮（吸引感），停靠后点亮
  if (dockLRef.value) {
    dockLRef.value.style.opacity = (0.35 + 0.65 * (posX <= 0 ? near : 0)).toFixed(3)
    dockLRef.value.classList.toggle('is-seated', swingLatched.value === -1)
  }
  if (dockRRef.value) {
    dockRRef.value.style.opacity = (0.35 + 0.65 * (posX >= 0 ? near : 0)).toFixed(3)
    dockRRef.value.classList.toggle('is-seated', swingLatched.value === 1)
  }
}

function updateSwingGeometry() {
  const wrapper = swingHost.value?.parentElement
  if (!wrapper) return
  swingR = wrapper.clientWidth / 2
  // 滑轨终点 = 圆缘：胶囊停靠时一半在圆内、一半嵌进圆框外的括号形底座
  swingXMax = swingR
  const bi = swingR - SWING.dockIn
  const bo = swingR + SWING.dockOut
  const y = SWING.dockY
  dockLRef.value?.setAttribute(
    'd',
    `M ${(-bi).toFixed(1)} ${-y} L ${(-bo).toFixed(1)} ${-y} L ${(-bo).toFixed(1)} ${y} L ${(-bi).toFixed(1)} ${y}`,
  )
  dockRRef.value?.setAttribute(
    'd',
    `M ${bi.toFixed(1)} ${-y} L ${bo.toFixed(1)} ${-y} L ${bo.toFixed(1)} ${y} L ${bi.toFixed(1)} ${y}`,
  )
  renderSwing()
}

function swingLoop() {
  const now = performance.now()
  const dt = Math.min(Math.max((now - lastSwingT) / 1000, 0.001), 0.033)
  lastSwingT = now
  if (!swingDragging.value && capsuleRef.value) {
    if (swingLatched.value !== 0) {
      // 弹簧吸到锁定边缘，带一点回摆稳住（不许越过滑轨边界）
      const target = swingLatched.value * swingXMax
      velX += (-SWING.w0 * SWING.w0 * (posX - target) - SWING.damp * velX) * dt
      posX += velX * dt
      if (posX < -swingXMax) {
        posX = -swingXMax
        velX = 0
      } else if (posX > swingXMax) {
        posX = swingXMax
        velX = 0
      }
    } else {
      // 阻尼弹簧：松手后按拽动方向的惯性来回摆动，撞到圆缘轻微反弹
      velX += (-SWING.w0 * SWING.w0 * posX - SWING.damp * velX) * dt
      posX += velX * dt
      if (posX < -swingXMax) {
        posX = -swingXMax
        velX = Math.abs(velX) * 0.35
      } else if (posX > swingXMax) {
        posX = swingXMax
        velX = -Math.abs(velX) * 0.35
      }
      if (Math.abs(posX) < 0.2 && Math.abs(velX) < 5) {
        posX = 0
        velX = 0
      }
    }
    applyVolume()
    renderSwing()
  }
  swingRafId = requestAnimationFrame(swingLoop)
}

function xFromPointer(e) {
  const wrapper = swingHost.value?.parentElement
  if (!wrapper) return
  const rect = wrapper.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  // 相对拖拽：胶囊跟随指针相对按下点的位移，而不是吸附到指针绝对位置
  posX = Math.max(-swingXMax, Math.min(swingXMax, e.clientX - cx + grabDX))
}

// 松手惯性：取轨迹窗口首尾的位移差——反映这一下的拽动方向，而非静止位置
function releaseVelocity() {
  if (velHist.length < 2) return 0
  const a = velHist[0]
  const b = velHist[velHist.length - 1]
  const dt = (b.t - a.t) / 1000
  if (dt < 0.005) return 0
  return Math.max(-1500, Math.min(1500, (b.x - a.x) / dt))
}

async function ensurePlaying() {
  if (!audioContext) await initAudio()
  await playAudio()
}

function onCapsulePointerDown(e) {
  capsuleRef.value?.setPointerCapture(e.pointerId)
  swingDragging.value = true
  velX = 0
  velHist.length = 0
  downX = e.clientX
  downY = e.clientY
  downT = performance.now()
  dragMoved = false
  // 记住按下时指针与胶囊的偏差，之后只按拖动方向/距离移动胶囊
  const wrapper = swingHost.value?.parentElement
  if (wrapper) {
    const rect = wrapper.getBoundingClientRect()
    grabDX = posX - (e.clientX - (rect.left + rect.width / 2))
  }
}

function onCapsulePointerMove(e) {
  if (!swingDragging.value) return
  if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) dragMoved = true
  xFromPointer(e)
  // 记录最近 ~120ms 的位移轨迹，松手时用窗口首尾差估算惯性
  const now = performance.now()
  velHist.push({ t: now, x: posX })
  while (velHist.length && now - velHist[0].t > 120) velHist.shift()

  const v = applyVolume()
  // 拖回中间区间 → 解除锁定并恢复播放
  if (swingLatched.value !== 0 && Math.abs(posX) < swingXMax * SWING.xOff) {
    swingLatched.value = 0
  }
  if (v <= 0) {
    if (isPlaying.value) pauseAudio()
  } else if (swingLatched.value === 0 && !isPlaying.value) {
    void ensurePlaying()
  }
  renderSwing()
}

function onCapsulePointerUp() {
  if (!swingDragging.value) return
  swingDragging.value = false

  const isTap = !dragMoved && performance.now() - downT < 400
  if (isTap) {
    // 轻点：锁定态 → 解锁回中并播放；否则切换播放/暂停
    if (swingLatched.value !== 0) {
      swingLatched.value = 0
      void ensurePlaying()
    } else if (isPlaying.value) {
      pauseAudio()
    } else {
      void ensurePlaying()
    }
    return
  }

  velX = releaseVelocity()
  if (Math.abs(posX) >= swingXMax * SWING.xOff) {
    // 拖到边缘：锁定关闭，摆锤停在边缘
    swingLatched.value = posX > 0 ? 1 : -1
    pauseAudio()
  } else {
    // 中途松手：按拽动方向带惯性摆动
    swingLatched.value = 0
    if (!isPlaying.value) void ensurePlaying()
  }
}
// ---------- 音量摆锤结束 ----------

const initAudio = async () => {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    
    audioElement = new Audio(backgroundMusic)
    audioElement.loop = true
    audioElement.crossOrigin = 'anonymous'
    
    source = audioContext.createMediaElementSource(audioElement)
    source.connect(analyser)
    analyser.connect(audioContext.destination)
    
    const bufferLength = analyser.frequencyBinCount
    dataArray = new Uint8Array(bufferLength)
    
    startWaveAnimation()
  } catch (error) {
    console.error('音频初始化失败:', error)
  }
}

const playAudio = async () => {
  if (audioContext && audioContext.state === 'suspended') {
    await audioContext.resume()
  }

  if (audioElement) {
    await audioElement.play()
    isPlaying.value = true
    // 暂停后循环已被停掉，恢复播放时重新启动声波动画
    if (animationId === null) {
      startWaveAnimation()
    }
  }
}

const pauseAudio = () => {
  if (audioElement) {
    audioElement.pause()
    isPlaying.value = false
  }
  // 停止声波绘制循环，避免后台持续占用 CPU
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}

const startWaveAnimation = () => {
  const canvas = waveCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  let time = 0
  
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    time += 0.02
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (analyser && isPlaying.value) {
      analyser.getByteFrequencyData(dataArray)
      
      const centerX = 300
      const centerY = 300
      // 声纹与头像之间的间距
      const gap = 30
      // 声纹的基础半径（基于头像大小）
      const radius = avatarRadius + gap
      
      // 声纹的数量
      const bars = 80
      const angleStep = (Math.PI * 2) / bars
      
      for (let i = 0; i < bars; i++) {
        const angle = i * angleStep
        const frequency = dataArray[i] || 0
        const normalizedFreq = frequency / 255
        
        // 添加一些噪声使声纹更自然
        const noise1 = Math.sin(i * 0.8) * 0.5
        const noise2 = Math.cos(i * 0.5) * 0.3
        const noise3 = Math.sin(i * 1.2) * 0.2
        const noise = noise1 + noise2 + noise3
        // 声纹高度计算：基于音频频率，添加噪声和基础值
        const barHeight = Math.max(2, normalizedFreq * 40 + 5 + noise * 25)
        
        const x1 = centerX + Math.cos(angle) * (radius - barHeight / 2)
        const y1 = centerY + Math.sin(angle) * (radius - barHeight / 2)
        const x2 = centerX + Math.cos(angle) * (radius + barHeight / 2)
        const y2 = centerY + Math.sin(angle) * (radius + barHeight / 2)
        
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
        
        if (isDark.value) {
          gradient.addColorStop(0, `rgba(138, 43, 226, ${0.4 + normalizedFreq * 0.6})`)
          gradient.addColorStop(0.5, `rgba(170, 126, 247, ${0.6 + normalizedFreq * 0.4})`)
          gradient.addColorStop(1, `rgba(138, 43, 226, ${0.4 + normalizedFreq * 0.6})`)
        } else {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${0.4 + normalizedFreq * 0.6})`)
          gradient.addColorStop(0.5, `rgba(167, 254, 215, ${0.6 + normalizedFreq * 0.4})`)
          gradient.addColorStop(1, `rgba(255, 255, 255, ${0.4 + normalizedFreq * 0.6})`)
        }
        
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = gradient
        // 声纹粗细计算：基于音频频率
        ctx.lineWidth = 1.5 + normalizedFreq * 2
        ctx.lineCap = 'round'
        ctx.stroke()
      }
      
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = isDark.value 
        ? 'rgba(138, 43, 226, 0.25)'
        : 'rgba(66, 239, 172, 0.25)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      
      for (let i = 0; i < 8; i++) {
        const ringAngle = (i / 8) * Math.PI * 2 + time * 0.5
        const ringRadius = radius + 30 + Math.sin(time + i) * 10
        const opacity = (Math.sin(time * 1.5 + i) + 1) / 2 * 0.15
        
        ctx.beginPath()
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2)
        ctx.strokeStyle = isDark.value 
          ? `rgba(138, 43, 226, ${opacity})`
          : `rgba(66, 239, 172, ${opacity})`
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }
  }
  
  animate()
}

const resizeCanvas = () => {
  const canvas = waveCanvas.value
  const avatar = avatarElement.value
  if (canvas && avatar) {
    canvas.width = 600
    canvas.height = 600

    const avatarRect = avatar.getBoundingClientRect()
    avatarRadius = avatarRect.width / 2
  }

  updateSwingGeometry()
}



onBeforeUnmount(() => {
  if (drawRafId) {
    cancelAnimationFrame(drawRafId)
  }

  if (swingRafId) {
    cancelAnimationFrame(swingRafId)
  }

  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  if (audioElement) {
    audioElement.pause()
    audioElement = null
  }
  
  if (source) {
    source.disconnect()
    source = null
  }
  
  if (analyser) {
    analyser.disconnect()
    analyser = null
  }
  
  if (audioContext) {
    audioContext.close()
    audioContext = null
  }
  
  window.removeEventListener('resize', resizeCanvas)

  if (themeObserver) {
    themeObserver.disconnect()
    themeObserver = null
  }

  if (fadeObserver) {
    fadeObserver.disconnect()
    fadeObserver = null
  }
})

const scrollToSection = (sectionId) => {
  if (window.location.pathname !== '/') {
    window.location.href = `/#${sectionId.substring(1)}`
  } else {
    const element = document.querySelector(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }
}
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: visible;
  background: transparent;
  padding-top: 80px;
}

/* .hero 是 flex 容器，container 作为 flex item 会按内容收缩；
   玻璃框需要随视口铺开，强制占满可用宽度（仍受 max-width 1200 约束） */
.hero .container {
  width: 100%;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-shape {
  position: absolute;
  border-radius: 50%;
  background: var(--gradient-primary);
  opacity: 0.1;
}



.yu, .nuo {
    display: inline-block;
    /* 新轨迹宽高比不同（121:110 / 94:110），按等高排布保证两字大小一致 */
    height: 140px;
    width: auto;
}


.shape-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: 100px;
  left: -100px;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 20%;
  background: var(--gradient-accent);
}

.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  /* 默认不触发动画，进入视口时添加 .is-visible 来启动动画 */
}

.fade-in-up.is-visible {
  animation: fadeInUp 0.8s ease-out forwards;
}

/* 标题动画 */
.hero-title.fade-in-up {
  animation-delay: 0.1s;
}

/* 按钮动画 */
.hero-actions.fade-in-up {
  animation-delay: 0.5s;
}

/* 数据统计动画 */
.hero-stats.fade-in-up {
  animation-delay: 0.7s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 确保动画只在首次加载时触发 */
.hero-title,
.hero-actions,
.hero-stats {
  opacity: 0; /* 初始状态隐藏 */
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 2;
  overflow: visible;

  /* 液态玻璃框：磨砂底 + 半透明渐变 + 光泽高光边 + 悬浮投影 */
  padding: 3rem 3.5rem;
  border-radius: 36px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.16) 0%,
    rgba(255, 255, 255, 0.05) 45%,
    rgba(255, 255, 255, 0.11) 100%
  );
  backdrop-filter: blur(18px) saturate(1.5);
  -webkit-backdrop-filter: blur(18px) saturate(1.5);
  border: 1px solid rgba(255, 255, 255, 0.38);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.12),
    0 24px 70px rgba(31, 45, 61, 0.18);
}

/* 液态玻璃的流光：一道缓慢游移的对角高光 */
.hero-content::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    115deg,
    transparent 32%,
    rgba(255, 255, 255, 0.22) 46%,
    rgba(255, 255, 255, 0.06) 54%,
    transparent 68%
  );
  background-size: 250% 100%;
  animation: glass-sheen 9s ease-in-out infinite;
  pointer-events: none;
  z-index: 3;
}

@keyframes glass-sheen {
  0%, 100% { background-position: 130% 0; }
  50% { background-position: -30% 0; }
}

.dark .hero-content {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.02) 45%,
    rgba(255, 255, 255, 0.05) 100%
  );
  border-color: rgba(255, 255, 255, 0.16);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.24),
    inset 0 -1px 0 rgba(255, 255, 255, 0.06),
    0 24px 70px rgba(0, 0, 0, 0.45);
}

.hero-title {
  font-size: 3.4rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.4rem;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
}

.hello-line {
  font-size: 0.6em;
  font-weight: 600;
  letter-spacing: 0.42em;
  text-indent: 0.42em;
  color: var(--text-secondary);
}

.calligraphy-line {
  display: flex;
  align-items: center;
  gap: 14px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.6rem;
  flex-wrap: wrap;
}

.hero-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat {
  text-align: center;
  padding: 0.9rem 1.6rem;
  border-radius: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: var(--shadow);
}

.stat-number {
  display: block;
  font-size: 1.9rem;
  font-weight: 800;
  font-family: var(--font-display);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.82rem;
  letter-spacing: 0.14em;
  color: var(--text-secondary);
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.avatar-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
}

/* 画框般的环绕光环 */
.avatar-wrapper::before {
  content: '';
  position: absolute;
  inset: -20px;
  border-radius: 50%;
  border: 1.5px dashed var(--primary-color);
  opacity: 0.35;
  animation: art-spin 48s linear infinite;
  pointer-events: none;
}

.avatar-wrapper::after {
  content: '';
  position: absolute;
  inset: -44px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--shadow-glow) 0%, transparent 70%);
  opacity: 0.55;
  filter: blur(8px);
  pointer-events: none;
}

@keyframes art-spin {
  to {
    transform: rotate(360deg);
  }
}

.wave-canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  z-index: 1;
  pointer-events: none;
  filter: blur(0.3px);
  opacity: 0.95;
}

.avatar {
  width: 330px;
  height: 330px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow:
    0 0 0 5px var(--bg-card),
    0 0 0 7px rgba(255, 255, 255, 0.35),
    0 18px 50px rgba(30, 64, 60, 0.22),
    0 0 60px var(--shadow-glow);
  position: relative;
  z-index: 2;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 禁止原生图片拖拽：否则拖摆锤时浏览器会劫持手势去拖头像（pointercancel） */
  -webkit-user-drag: none;
  user-select: none;
}



/* ---------- 音量摆锤 ---------- */
/* 宿主零尺寸锚点在头像中心，子元素用相对中心的坐标摆放，overflow 均可见 */
.swing-volume {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  z-index: 10;
}

.swing-lines {
  position: absolute;
  left: -320px;
  top: -320px;
  width: 640px;
  height: 640px;
  overflow: visible;
  pointer-events: none;
}

.swing-line {
  stroke: rgba(0, 180, 216, 0.55);
  stroke-width: 2;
  stroke-linecap: round;
  filter: drop-shadow(0 0 4px rgba(0, 180, 216, 0.45));
  transition: stroke 0.25s ease;
}

/* 磁吸底座：圆框外侧的括号形卡槽，虚线待命，胶囊停靠后变实线满亮 */
.swing-dock {
  fill: none;
  stroke: rgba(0, 180, 216, 0.6);
  stroke-width: 2.5;
  stroke-dasharray: 6 8;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.35;
  transition: opacity 0.25s ease, stroke-dasharray 0.25s ease;
}

.swing-dock.is-seated {
  stroke-dasharray: none;
  filter: drop-shadow(0 0 7px rgba(0, 180, 216, 0.7));
}

.swing-volume.is-dragging .swing-line,
.swing-volume.is-dragging .swing-capsule {
  --swing-accent: rgba(0, 180, 216, 0.95);
}

.swing-capsule {
  --swing-accent: rgba(0, 180, 216, 0.55);
  position: absolute;
  left: -9px;
  top: -27px;
  width: 18px;
  height: 54px;
  border-radius: 10px;
  background: rgba(0, 180, 216, 0.18);
  border: 2px solid var(--swing-accent);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 4px 20px rgba(0, 180, 216, 0.3),
    inset 0 0 20px rgba(0, 180, 216, 0.1);
  cursor: grab;
  touch-action: none;
  user-select: none;
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform;
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.swing-capsule:hover {
  background: rgba(0, 180, 216, 0.32);
  box-shadow:
    0 8px 30px rgba(0, 180, 216, 0.4),
    inset 0 0 30px rgba(0, 180, 216, 0.15);
}

.swing-volume.is-dragging .swing-capsule {
  cursor: grabbing;
}

/* 内芯亮度 = 音量（--vol 由 JS 写入），随拖动实时变暗/变亮 */
.swing-capsule::after {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 7px;
  background: linear-gradient(180deg, rgba(66, 239, 172, 0.95), rgba(0, 180, 216, 0.75));
  opacity: calc(var(--vol, 1) * 0.85);
  transition: opacity 0.15s ease;
}

/* 关闭（暂停）态：整体降亮度但保留色彩——停靠位置必须看得清，播放/暂停由图标表达 */
.swing-volume.is-off .swing-capsule {
  background: rgba(0, 180, 216, 0.1);
  border-color: rgba(0, 180, 216, 0.4);
  box-shadow: 0 4px 16px rgba(0, 180, 216, 0.15);
}

.swing-volume.is-off .swing-line {
  stroke: rgba(0, 180, 216, 0.32);
  filter: none;
}

.swing-volume.is-off .swing-dock {
  stroke: rgba(0, 180, 216, 0.32);
}

.swing-volume.is-off .swing-dock.is-seated {
  filter: drop-shadow(0 0 5px rgba(0, 180, 216, 0.5));
}

.capsule-icon {
  color: #fff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
  position: relative;
  z-index: 1;
  pointer-events: none;
}

/* 深色模式摆锤 */
.dark .swing-line {
  stroke: rgba(170, 126, 247, 0.55);
  filter: drop-shadow(0 0 4px rgba(170, 126, 247, 0.45));
}

.dark .swing-dock {
  stroke: rgba(170, 126, 247, 0.6);
}

.dark .swing-dock.is-seated {
  filter: drop-shadow(0 0 7px rgba(170, 126, 247, 0.7));
}

.dark .swing-volume.is-off .swing-capsule {
  background: rgba(170, 126, 247, 0.12);
  border-color: rgba(170, 126, 247, 0.45);
  box-shadow: 0 4px 16px rgba(170, 126, 247, 0.18);
}

.dark .swing-volume.is-off .swing-line,
.dark .swing-volume.is-off .swing-dock {
  stroke: rgba(170, 126, 247, 0.32);
}

.dark .swing-volume.is-off .swing-dock.is-seated {
  filter: drop-shadow(0 0 5px rgba(170, 126, 247, 0.5));
}

.dark .swing-volume.is-dragging .swing-line {
  stroke: rgba(170, 126, 247, 0.95);
}

.dark .swing-capsule {
  background: rgba(89, 28, 135, 0.25);
  border-color: rgba(170, 126, 247, 0.55);
  box-shadow:
    0 4px 20px rgba(89, 28, 135, 0.3),
    inset 0 0 20px rgba(89, 28, 135, 0.15);
}

.dark .swing-volume.is-dragging .swing-capsule {
  border-color: rgba(170, 126, 247, 0.95);
}

.dark .swing-capsule::after {
  background: linear-gradient(180deg, rgba(196, 165, 247, 0.95), rgba(138, 43, 226, 0.75));
}

.dark .swing-capsule:hover {
  background: rgba(89, 28, 135, 0.4);
  box-shadow:
    0 8px 30px rgba(89, 28, 135, 0.4),
    inset 0 0 30px rgba(89, 28, 135, 0.2);
}

/* 深色模式摆锤样式见上方 .dark .swing-* 规则 */



.yu, .nuo {
  display: inline-block;
  height: 140px;
  width: auto;
}

/* 书法笔画轮廓（来自 public/assets/余.svg、诺.svg）：细描边勾轮廓，
   描完后 fill-opacity 由透明渐显为实心（初始透明由 CSS 兜底，JS 逐帧驱动） */
.animated-svg path {
  fill: currentColor;
  fill-opacity: 0;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* 描边配色取自新 SVG（余 #a097f2 / 诺 #97b9f2） */
.yu {
  color: #a097f2;
}

.nuo {
  color: #97b9f2;
}

@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
    padding: 2rem 1.5rem;
    border-radius: 28px;
  }
  
  .hero-title {
    font-size: 2.5rem;
    align-items: center;
  }
  
  .avatar {
    width: 250px;
    height: 250px;
  }

  .shape-1 {
    width: 200px;
    height: 200px;
    right: -50px;
  }
  
  .shape-2 {
    width: 150px;
    height: 150px;
  }
  
  .wave-canvas {
    width: 400px;
    height: 400px;
  }
}

@media (max-width: 768px) {
  /* 移动端地址栏收起/展开时避免首屏高度跳动 */
  .hero {
    min-height: 100svh;
    min-height: 100dvh;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .hero-title {
    font-size: 2rem;
  }

  .yu, .nuo {
    height: 100px;
  }
  
  .hero-content {
    gap: 3rem;
    padding: 1.5rem 1rem;
    border-radius: 24px;
  }
  
  .hero-stats {
    gap: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }

  .shape-1,
  .shape-2,
  .shape-3 {
    display: none;
  }
  
  .wave-canvas {
    width: 300px;
    height: 300px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .yu, .nuo {
    height: 80px;
  }
  
  .hero-stats {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .stat {
    min-width: 80px;
  }
  
  .avatar {
    width: 200px;
    height: 200px;
  }
}
</style>