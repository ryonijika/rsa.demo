function gcd(p, q) { // ユークリッドの互除法で最大公約数を求める
	let r;

	do {
		r = BigInt(p) % BigInt(q);
		p = q;
		q = r;
	} while (r != 0n);

	return p;
}

function gcdExtended(a, b) {
    a = BigInt(a);
    b = BigInt(b);
    if (a == 0n) {
        return [b, 0n, 1n];
    }
    let [gcd, x1, y1] = gcdExtended(b % a, a);
    let x = y1 - (b / a) * x1;
    let y = x1;
    return [gcd, x, y];
}

function lcm(p, q) {
	return (p * q) / gcd(p, q); // 最大公約数を用いて最小公倍数を求める
}

function IsPrime(p, q){
	if (gcd(p, q) == 1n){
		return true;
	}
	return false;
}

function powerMod(base, e, mod) {
    base = BigInt(base);
    e = BigInt(e);
    mod = BigInt(mod);

    if (mod == 1n) {
    	return 0n; // mod1の場合は常に0
    }

    let result = 1n;
    base = base % mod;

    do {
        if (e % 2n == 1n) {
            result = (result * base) % mod;
        }
        e = e / 2n;
        base = (base * base) % mod;
    } while (e > 0n);

    return result;
}

function generateKeypair(p, q) {
    p = BigInt(p);
    q = BigInt(q);

    let n = p * q;
    let L = (p - 1n) * (q - 1n) / gcd(p - 1n, q - 1n);
    let e = 58049n;
    let d = gcdExtended(e, L)[1];
    if (d < 0n) {
        d += L;
    }

    let public = {"e": e, "n": n}; // 公開鍵
    let private = {"d": d, "n": n}; // 秘密鍵
    return {"public": public, "private": private};
}

function encrypt(plain, key) {
	return powerMod(BigInt(plain), key.e, key.n);
}

function decrypt(encrypted, key) {
	return powerMod(BigInt(encrypted), key.d, key.n);
}

function codeOf(text) {
	let coded = [];
	for (let i = 0; i < text.length; i++) {
		coded.push(BigInt(text.charCodeAt(i)));
	}
	return coded;
}

function charOf(coded) {
	let text = '';
	for (let i = 0; i < coded.length; i++) {
		text += String.fromCharCode(Number(coded[i]));
	}
	return text;
}

function encryptArray(array, key) {
	let encrypted = [];
	for (let i = 0; i < array.length; i++) {
		encrypted.push(encrypt(array[i], key));
	}
	return encrypted;
}

function decryptArray(array, key) {
	let decrypted = [];
	for (let i = 0; i < array.length; i++) {
		decrypted.push(decrypt(array[i], key));
	}
	return decrypted;
}

function arrayToText(array) {
	return array.join(' ');
}

function textToArray(text) {
	return text.split(' ').map(str => BigInt(str));
}

function encryptText(text, key) {
	return arrayToText(
		encryptArray(
			codeOf(text),
			key
		)
	);
}

function decryptText(text, key) {
	return charOf(
		decryptArray(
			textToArray(text),
			key
		)
	);
}

function actionGenerateKeys() {
	let pElem = document.getElementById('p_generate');
	let qElem = document.getElementById('q_generate');
	let neElem = document.getElementById('ne_generate');
	let ndElem = document.getElementById('nd_generate');
	let eElem = document.getElementById('e_generate');
	let dElem = document.getElementById('d_generate');

	let p = BigInt(pElem.value);
	let q = BigInt(qElem.value);

	let keys = generateKeypair(p, q);

	neElem.innerText = keys.public.n.toString();
	ndElem.innerText = keys.public.n.toString();
	eElem.innerText = keys.public.e.toString();
	dElem.innerText = keys.private.d.toString();
}

function actionEncrypt() {
	let nElem = document.getElementById('n_encrypt');
	let eElem = document.getElementById('e_encrypt');
	let textElem = document.getElementById('text_encrypt');
	let encryptedElem = document.getElementById('encrypted_encrypt');

	let n = BigInt(nElem.value);
	let e = BigInt(eElem.value);
	let text = textElem.value;

	let key = {"e": e, "n": n};
	let encrypted = encryptText(text, key);

	encryptedElem.innerText = encrypted;
}

function actionDecrypt() {
	let dElem = document.getElementById('d_decrypt');
	let nElem = document.getElementById('n_decrypt');
	let encryptedElem = document.getElementById('encrypted_decrypt');
	let decryptedElem = document.getElementById('decrypted_decrypt');

	let d = BigInt(dElem.value);
	let n = BigInt(nElem.value);
	let encrypted = encryptedElem.value;

	let key = {"d": d, "n": n};
	let decrypted = decryptText(encrypted, key);

	decryptedElem.innerText = decrypted;
}

function copyToClipboard() {
	let encryptedElem = document.getElementById('encrypted_encrypt');
	let encrypted = encryptedElem.innerText;
	navigator.clipboard.writeText(encrypted).then(() => {
		alert('コピーされました');
	});
}
