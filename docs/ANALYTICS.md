# Sol visitor statistics · Sol-ийн зочлолтын статистик

## Монгол

Sol вэбсайт нь **GoatCounter**-оор хуудас болон хэрэгслийн зочлолтын нэгтгэсэн тоог хэмжинэ. Бид ямар хэрэгсэлд хэдэн удаа зочилсныг, мөн зочдын улс орон, хөтөч болон хандсан эх сурвалжийн ерөнхий мэдээллийг харж болно. Энэ нь хэрэглэгч бүрийг таних зориулалттай бүртгэл биш.

Хэрэгслийн товчлуур даралт, тохиргоо, оруулсан тоо, файл, дуу зэрэг агуулгыг тусгай үйл явдал болгон бүртгэхгүй. `?lang=mn` гэх мэт URL параметрүүдийг статистикийн замд нэмэхгүй. Олон хуудастай нэг хэрэгслийн хуудаснууд нэг замд (`/sol/<tool-id>/`) тоологдоно; хуучин `/sol/tools/` шилжүүлгийн хуудсууд тусад нь тоологдохгүй.

GoatCounter-ийн зочлолтын тоолуур нь күүки болон хөтчийн хадгалалтад мөрдөгч таних тэмдэг тавьдаггүй. Улс орны мэдээллийг IP хаягаар ойролцоогоор тодорхойлдог боловч үйлчилгээ IP хаягийг статистикийн өгөгдлийн санд хадгалдаггүй. Хэрэгсэл өөрөө интерфэйсийн сонголтыг тусад нь хөтчид хадгалж болно.

Хуудас нь зөвхөн `gantemur.github.io` дээр ачаалагдсан үед GoatCounter-ийн жижиг скриптийг `gc.zgo.at` хаягаас татаж, `gantemur-sol.goatcounter.com/count` руу зочлолтын мэдээлэл илгээнэ. Та скриптийг хаах боломжтой. Илүү дэлгэрэнгүй: [GoatCounter-ийн нууцлалын бодлого](https://www.goatcounter.com/help/privacy).

## English

Sol uses **GoatCounter** for aggregate website and tool visit statistics, including approximate visitor countries, general browser information, and referrers. It is not intended to identify individual visitors.

No tool-control clicks, settings, numerical inputs, files, or audio are tracked as events. Language and other query parameters are excluded from the tracked path. Multi-page tools are grouped under their canonical `/sol/<tool-id>/` path; legacy `/sol/tools/` forwarding pages are not tracked separately.

GoatCounter tracking uses no cookies or browser-stored tracking identifiers. It derives approximate country information from IP addresses but does not store IP addresses in its analytics database. Individual Sol tools may independently store interface preferences in the browser.

On `gantemur.github.io`, pages load a small script from `gc.zgo.at` and send visit data to `gantemur-sol.goatcounter.com/count`. Visitors can block this script. See [GoatCounter's privacy policy](https://www.goatcounter.com/help/privacy).

This is a small, optional external dependency for statistics, not for the operation of any Sol tool.
