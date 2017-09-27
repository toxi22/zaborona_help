const nets = `
  pasted content of https://zaborona.help/ips.txt here
# Vkontakte
# ------------------------
87.240.128.0/18
93.186.224.0/20
95.142.192.0/20
95.213.0.0/18
185.29.130.0/24
185.32.248.0/22


# Yandex
# ------------------------
5.45.192.0/18
5.255.192.0/18
37.9.64.0/18
37.140.128.0/18
77.75.152.0/21
77.88.0.0/18
84.201.128.0/18
87.250.224.0/19
93.158.128.0/18
95.108.128.0/17
100.43.64.0/19
109.235.160.0/21
130.193.32.0/19
141.8.128.0/18
178.154.128.0/17
185.32.185.0/24
185.32.186.0/24
185.71.76.0/22
199.21.96.0/22
199.36.240.0/22
213.180.192.0/19

2001:678:384::/48
2620:10f:d000::/44
2a02:6b8::/32
2a02:5180::/32

# Mail.ru 
# ------------------------
5.61.16.0/21
5.61.232.0/21
79.137.157.0/24
79.137.183.0/24
94.100.176.0/20
95.163.32.0/19
95.163.248.0/21
128.140.168.0/21
178.22.88.0/21
178.237.16.0/20
185.5.136.0/22
185.16.148.0/22
185.16.244.0/22
188.93.56.0/21
194.186.63.0/24
195.211.20.0/22
195.218.168.0/24
217.20.144.0/20
217.69.128.0/20
195.211.128.0/22
208.87.92.0/22
185.6.244.0/22
185.30.176.0/22
195.218.190.0/23

2a00:1148::/32
2a00:a300::/32
2a00:b4c0::/32
2a04:4b40::/29

# Mamba.ru (love.mail.ru)
# ------------------------
193.0.170.24/29

# Kaspersky Lab
# ------------------------
77.74.176.0/21
91.103.64.0/21
93.159.224.0/21
185.54.220.0/23
185.85.12.0/24
185.85.14.0/23

2a03:2480::/33

# DrWeb
# ------------------------
195.88.252.0/23
178.248.232.183/32
178.248.233.94/32
`.split(/\s+/)  // split on \n, also removing leading/trailing space
 .filter( (s)=>s.match(/\d+\.\d+\.\d+\.\d+\/\d+/) )  // filter-out all but ip4
 .map( (s) => s.split('/') ) // split each net on ip-addr and subnet bits
 .map( (a) => [a[0], mkMask(a[1])] );  // convert CIDR to subnet mask 


function mkMask(s) {  // convert CIDR notation /24 to mask 255.255.255.0 etc.
    const mask = 0xffffffff<<(32-Number(s));
    return [24,16,8,0].map( (n) => (mask >>> n) & 0xff ).join('.');
  // (using '>>>' and not '>>' so that result is unsigned)
}

function FindProxyForURL(url, host) {
    if ( nets.some( (net) => isInNet( dnsResolve(host), net[0], net[1]) ) ) {
        return 'SOCKS5 socks.zaborona.help:1488; DIRECT';
    } else {
        return 'DIRECT';
    }
}
