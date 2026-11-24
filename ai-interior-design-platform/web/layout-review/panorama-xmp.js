// https://developers.google.com/streetview/spherical-metadata
export async function tagEquirectangularJpeg(jpeg, width, height) {
  const header = new Uint8Array(await jpeg.slice(0, 6).arrayBuffer());
  if (header[0] !== 0xff || header[1] !== 0xd8) throw new Error("全景样张未能编码为 JPEG。");
  const jfifLength = header[2] === 0xff && header[3] === 0xe0 ? (header[4] << 8) + header[5] : 0;
  const insertAt = jfifLength >= 2 && jfifLength + 4 < jpeg.size ? jfifLength + 4 : 2;
  const xmp = new TextEncoder().encode(
    "http://ns.adobe.com/xap/1.0/\0" +
    '<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
    '<rdf:Description rdf:about="" xmlns:GPano="http://ns.google.com/photos/1.0/panorama/" ' +
    'GPano:UsePanoramaViewer="True" GPano:ProjectionType="equirectangular" ' +
    `GPano:FullPanoWidthPixels="${width}" GPano:FullPanoHeightPixels="${height}" ` +
    `GPano:CroppedAreaImageWidthPixels="${width}" GPano:CroppedAreaImageHeightPixels="${height}" ` +
    'GPano:CroppedAreaLeftPixels="0" GPano:CroppedAreaTopPixels="0"/></rdf:RDF></x:xmpmeta>',
  );
  const segmentLength = xmp.length + 2;
  const marker = new Uint8Array([0xff, 0xe1, segmentLength >>> 8, segmentLength & 0xff]);
  return new Blob([jpeg.slice(0, insertAt), marker, xmp, jpeg.slice(insertAt)], { type: "image/jpeg" });
}
