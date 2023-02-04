#!/bin/bash
set -e

# Generate knot-resolver aliases
#cp result/knot-aliases-alt.conf /etc/knot-resolver/knot-aliases-alt.conf
#systemctl restart kresd@1.service

# Generate dnsmasq aliases
cp result/dnsmasq-aliases-alt.conf /etc/dnsmasq.d/zaborona-dns-resovler
#systemctl restart dnsmasq

# Generate OpenVPN route file
cp config/openvpn-ccd-DEFAULT.txt result/openvpn-blocked-ranges_ext.txt
#cp result/openvpn-blocked-ranges.txt /etc/openvpn/ccd/DEFAULT
while read -r line0
do

    echo "$line0" >> result/openvpn-blocked-ranges_ext.txt

done < result/openvpn-blocked-ranges.txt

cp result/openvpn-blocked-ranges_ext.txt /etc/openvpn/ccd/DEFAULT

# Generate squid zone file
#cp result/squid-whitelist-zones.conf /etc/squid/conf.d/DEFAULT

iptables -F ZABORONA_V4

#echo "" > result/ferm-whitelist-blocked-ranges.conf
#echo "# dummy file. Filled by zaboronahelp script." >> result/ferm-whitelist-blocked-ranges.conf
#echo "@def $WHITELIST = (" >> result/ferm-whitelist-blocked-ranges.conf

# Generate ferm file - IP ACCEPT
cp config/ferm-whitelist-blocked-ranges.conf result/ferm-whitelist-blocked-ranges.conf

while read -r line
do
    iptables -w -A ZABORONA_V4 -d "$line" -j ACCEPT
    echo "$line" >> result/ferm-whitelist-blocked-ranges.conf

done < result/blocked-ranges.txt

echo ");" >> result/ferm-whitelist-blocked-ranges.conf

cp result/ferm-whitelist-blocked-ranges.conf /etc/ferm/whitelist.conf
# Generate ferm file - IP ACCEPT

# Generate ferm file - Block Port
cp config/ferm-blockport.conf result/ferm-blockport.conf

while read -r line2
do
	iptables -I FORWARD 1 -p tcp --dport "$line2" -j DROP
	iptables -I FORWARD 1 -p udp --dport "$line2" -j DROP
    echo "$line2" >> result/ferm-blockport.conf

done < result/blockport.txt

echo ");" >> result/ferm-blockport.conf

cp result/ferm-blockport.conf /etc/ferm/blockport.conf
# Generate ferm file - Block Port

# Generate ferm file - Block String
cp config/ferm-blockstring.conf result/ferm-blockstring.conf

while read -r line3
do
	iptables -I FORWARD 1 -m string --string "$line3" --algo bm --to 65535 -j DROP
	#iptables -I FORWARD 1 -m string --string "$line3" --algo bm -j DROP
    echo "$line3" >> result/ferm-blockstring.conf

done < result/blockstring.txt

echo ");" >> result/ferm-blockstring.conf

cp result/ferm-blockstring.conf /etc/ferm/blockstring.conf
# Generate ferm file - Block String

#systemctl restart ferm

exit 0