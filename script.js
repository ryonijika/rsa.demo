function gcd(p, q) { // ユークリッドの互除法で最大公約数を求める
	let r

	do {
		r = p % q
		p = q
		q = r
	} while (r != 0)

	return p
}

function lcm(p, q) {
	return (p * q) / gcd(p, q) // 最大公約数を用いて最小公倍数を求める
}

function IsPrime(p, q){
	if (gcd(p, q) == 1){
		return true
	}
	return false
}

function powerMod(base, e, mod) {
    if (mod == 1) {
    	return 0; // mod1の場合は常に0
    }

    let result = 1;
    base = base % mod;

    do {
        if (e % 2 == 1) {
            result = (result * base) % mod;
        }
        e = Math.floor(e / 2);
        base = (base * base) % mod;
    } while (e > 0)

    return result;
}

function generateKeypair(p, q) {
    let n = p * q
    let L = (p - 1) * (q - 1) / gcd(p - 1, q - 1)
    let e = 58049
    let d = 1

    do {
    	d += 1
    } while ((e * d) % L != 1)

    let public = {"e": e, "n": n} // 公開鍵
    let private = {"d": d, "n": n} // 秘密鍵
    return {"public": public, "private": private}
}

function encrypt(plain, key) {
	return powerMod(plain, key.e, key.n)
}

function decrypt(encrypted, key) {
	return powerMod(encrypted, key.d, key.n)
}

function codeOf(text) {
	let coded = []
	for (let i = 0; i < text.length; i++) {
		coded.push(text.charCodeAt(i))
	}
	return coded
}

function charOf(coded) {
	let text = ''
	for (let i = 0; i < coded.length; i++) {
		text += String.fromCharCode(coded[i])
	}
	return text
}

function encryptArray(array, key) {
	let encrypted = []
	for (let i = 0; i < array.length; i++) {
		encrypted.push(
			encrypt(array[i], key)
			)
	}
	return encrypted
}

function decryptArray(array, key) {
	let decrypted = []
	for (let i = 0; i < array.length; i++) {
		decrypted.push(
			decrypt(array[i], key)
			)
	}
	return decrypted
}

function arrayToText(array) {
	return array.join(' ')
}

function textToArray(text) {
	return text.split(' ').map(str => parseInt(str, 10));
}

function encryptText(text, key) {
	return arrayToText(
		encryptArray(
			codeOf(text),
			key
			)
		)
}

function decryptText(text, key) {
	return charOf(
		decryptArray(
			textToArray(text),
			key
			)
		)
}


function actionGenerateKeys() {
	let pElem = document.getElementById('p_generate');
	let qElem = document.getElementById('q_generate');
	let neElem = document.getElementById('ne_generate');
	let ndElem = document.getElementById('nd_generate');
	let eElem = document.getElementById('e_generate');
	let dElem = document.getElementById('d_generate');

	p = Number(pElem.value)
	q = Number(qElem.value)

	let keys = generateKeypair(p, q)

	neElem.innerText = keys.public.n
	ndElem.innerText = keys.public.n
	eElem.innerText = keys.public.e
	dElem.innerText = keys.private.d
}

function actionEncrypt() {
	let nElem = document.getElementById('n_encrypt');
	let eElem = document.getElementById('e_encrypt');
	let textElem = document.getElementById('text_encrypt');
	let encryptedElem = document.getElementById('encrypted_encrypt');

	n = Number(nElem.value)
	e = Number(eElem.value)
	text = textElem.value

	let key = {"e": e, "n": n}
	let encrypted = encryptText(text, key)

	encryptedElem.innerText = encrypted
}

function actionDecrypt() {
	let dElem = document.getElementById('d_decrypt');
	let nElem = document.getElementById('n_decrypt');
	let encryptedElem = document.getElementById('encrypted_decrypt');
	let decryptedElem = document.getElementById('decrypted_decrypt');

	d = Number(dElem.value)
	n = Number(nElem.value)
	encrypted = encryptedElem.value

	let key = {"d": d, "n": n}
	let decrypted = decryptText(encrypted, key)

	decryptedElem.innerText = decrypted
}

function copyToClipboard() {
	let encryptedElem = document.getElementById('encrypted_encrypt');
	encrypted = encryptedElem.innerText
	navigator.clipboard.writeText(encrypted).then(e => {
		alert('コピーされました');
	});
}
