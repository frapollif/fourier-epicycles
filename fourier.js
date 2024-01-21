// Coding Challenge 130.3: Drawing with Fourier Transform and Epicycles
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/130.1-fourier-transform-drawing.html
// https://thecodingtrain.com/CodingChallenges/130.2-fourier-transform-drawing.html
// https://thecodingtrain.com/CodingChallenges/130.3-fourier-transform-drawing.html
// https://youtu.be/7_vKzcgpfvU


class Complex {
  constructor(a, b) {
    this.re = a;
    this.im = b;
  }

  add(c) {
    this.re += c.re;
    this.im += c.im;
  }

  mult(c) {
    const re = this.re * c.re - this.im * c.im;
    const im = this.re * c.im + this.im * c.re;
    return new Complex(re, im);
  }
}

function dft(x) {
  // Initialize an empty array to store the Fourier coefficients
  const X = [];
  // Get the number of samples
  const N = x.length;
  // Loop over each sample
  for (let k = 0; k < N; k++) {
    // Initialize a complex number to store the sum
    let sum = new Complex(0, 0);
    // Loop over each sample again
    for (let n = 0; n < N; n++) {
      // Calculate the phase angle
      const phi = (TWO_PI * k * n) / N;
      // Create a complex number from the cosine and sine of the phase angle
      const c = new Complex(cos(phi), -sin(phi));
      // Add the product of the current sample and the complex number to the sum
      sum.add(x[n].mult(c));
    }
    // Divide the real and imaginary parts of the sum by the number of samples
    sum.re = sum.re / N;
    sum.im = sum.im / N;

    // Calculate the frequency, amplitude, and phase of the Fourier coefficient
    let freq = k;
    let amp = sqrt(sum.re * sum.re + sum.im * sum.im);
    let phase = atan2(sum.im, sum.re);
    // Store the Fourier coefficient in the array
    X[k] = { re: sum.re, im: sum.im, freq, amp, phase };
  }
  // Return the array of Fourier coefficients
  return X;
}
